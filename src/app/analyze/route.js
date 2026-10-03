// src/app/analyze/route.js
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import https from 'https';
import http from 'http';

function fetchHtmlWithRedirects(targetUrl, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Too many redirects'));
    }

    let parsed;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return reject(new Error('Invalid URL'));
    }

    const client = parsed.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      rejectUnauthorized: false,
      timeout: 15000,
    };

    const req = client.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, targetUrl).toString();
        }
        return resolve(fetchHtmlWithRedirects(redirectUrl, maxRedirects - 1));
      }

      let data = '';
      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({ html: data, statusCode: res.statusCode, finalUrl: targetUrl });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 15 seconds'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let validUrl = url.trim().replace(/^['"]|['"]$/g, '');
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = 'https://' + validUrl;
    }

    let domain = '';
    try {
      domain = new URL(validUrl).hostname;
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    let fetchResult;
    try {
      fetchResult = await fetchHtmlWithRedirects(validUrl);
    } catch (firstErr) {
      if (validUrl.startsWith('https://')) {
        try {
          const fallbackHttp = validUrl.replace('https://', 'http://');
          fetchResult = await fetchHtmlWithRedirects(fallbackHttp);
        } catch {
          return NextResponse.json({
            error: `Could not connect to ${domain}. Please check if the website is online and accessible.`,
          }, { status: 502 });
        }
      } else {
        return NextResponse.json({
          error: `Could not connect to ${domain}. Please check if the website is online and accessible.`,
        }, { status: 502 });
      }
    }

    const { html } = fetchResult;
    if (!html || html.length < 150) {
      return NextResponse.json({
        error: `Website ${domain} returned empty content or blocked the request.`,
      }, { status: 422 });
    }

    const $ = cheerio.load(html);

    const title = $('title').first().text().trim() 
      || $('meta[property="og:title"]').attr('content')?.trim() 
      || '';

    const metaDesc = $('meta[name="description"]').attr('content')?.trim() 
      || $('meta[property="og:description"]').attr('content')?.trim() 
      || '';

    const canonical = $('link[rel="canonical"]').attr('href') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content')?.trim() || '';
    const ogImage = $('meta[property="og:image"]').attr('content')?.trim() || '';
    const favicon = $('link[rel*="icon"]').attr('href') || '';
    const langAttr = $('html').attr('lang') || '';

    const headingsH1 = [];
    $('h1').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text) headingsH1.push(text);
    });

    const headingsH2 = [];
    $('h2').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text) headingsH2.push(text);
    });

    const headingsH3 = [];
    $('h3').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text) headingsH3.push(text);
    });

    // Paragraphs for Google Snippet fallback (exactly what Google does)
    const paragraphs = [];
    $('p, article, .content, .description').each((_, el) => {
      const pText = $(el).text().replace(/\s+/g, ' ').trim();
      if (pText && pText.length > 35 && !pText.toLowerCase().includes('cookie') && !pText.toLowerCase().includes('copyright')) {
        paragraphs.push(pText);
      }
    });

    const rawLinks = [];
    const telLinks = [];
    const mailtoLinks = [];

    $('a').each((_, el) => {
      const href = $(el).attr('href') || '';
      const text = $(el).text().replace(/\s+/g, ' ').trim();

      if (href.toLowerCase().startsWith('tel:')) {
        telLinks.push(href);
      }
      if (href.toLowerCase().startsWith('mailto:')) {
        mailtoLinks.push(href);
      }
      if (text && text.length > 1 && text.length < 60) {
        rawLinks.push({ text, href });
      }
    });

    const rawBodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
    const detectedPhones = rawBodyText.match(phoneRegex) || [];
    const hasPhoneSignal = telLinks.length > 0 || detectedPhones.length > 0;

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const detectedEmails = rawBodyText.match(emailRegex) || [];
    const hasEmailSignal = mailtoLinks.length > 0 || detectedEmails.length > 0;

    const buttonTexts = [];
    $('button, input[type="submit"], input[type="button"], .btn, .button, a[class*="btn"], a[class*="button"]').each((_, el) => {
      const txt = $(el).text().replace(/\s+/g, ' ').trim() || $(el).attr('value') || '';
      if (txt && txt.length > 1 && txt.length < 40) {
        buttonTexts.push(txt);
      }
    });

    const ctaKeywords = [
      'contact', 'call', 'order', 'shop', 'quote', 'book', 'start', 'get', 'buy',
      'schedule', 'view', 'reserve', 'hire', 'explore', 'read', 'learn', 'more',
      'inquire', 'apply', 'send', 'message', 'discover', 'request', 'services', 'work', 'projects'
    ];

    const detectedCtas = new Set();
    rawLinks.forEach((l) => {
      const lower = l.text.toLowerCase();
      if (ctaKeywords.some((w) => lower.includes(w))) {
        detectedCtas.add(l.text);
      }
    });
    buttonTexts.forEach((b) => detectedCtas.add(b));

    const finalCtas = Array.from(detectedCtas).slice(0, 8);

    let totalImages = 0;
    let imagesMissingAlt = 0;
    $('img').each((_, el) => {
      totalImages++;
      const alt = $(el).attr('alt');
      if (!alt || alt.trim() === '') {
        imagesMissingAlt++;
      }
    });

    const schemas = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const parsed = JSON.parse($(el).text());
        schemas.push(parsed);
      } catch {}
    });

    const scriptCount = $('script').length;
    const stylesheetCount = $('link[rel="stylesheet"]').length;

    $('script, style, noscript, svg').remove();
    const cleanText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;

    return NextResponse.json({
      success: true,
      url: validUrl,
      domain,
      title: title || `${domain}`,
      metaDesc,
      firstParagraph: paragraphs[0] || '',
      canonical,
      ogTitle,
      ogImage,
      favicon,
      langAttr,
      wordCount,
      headingsH1,
      headingsH2,
      headingsH3,
      totalLinks: rawLinks.length,
      internalLinksTotal: rawLinks.filter((l) => l.href.startsWith('/') || l.href.includes(domain)).length,
      externalLinksTotal: rawLinks.filter((l) => l.href.startsWith('http') && !l.href.includes(domain)).length,
      ctas: finalCtas,
      totalImages,
      imagesMissingAlt,
      schemasTotal: schemas.length,
      hasSchemaFaq: schemas.some((s) => JSON.stringify(s).includes('FAQPage')),
      scriptCount,
      stylesheetCount,
      hasPhone: hasPhoneSignal,
      hasEmail: hasEmailSignal,
      telCount: telLinks.length,
      mailtoCount: mailtoLinks.length,
      hasHttps: validUrl.startsWith('https://'),
      hasHeader: $('header').length > 0,
      hasMain: $('main').length > 0,
      hasFooter: $('footer').length > 0,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server processing error' }, { status: 500 });
  }
}