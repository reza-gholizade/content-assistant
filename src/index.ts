export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Get the ASSETS binding (Cloudflare automatically creates this when assets are configured)
    const assets = env.ASSETS;
    
    if (!assets) {
      return new Response('ASSETS binding not found. Make sure assets are configured in wrangler.jsonc', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Handle root path - serve index.html immediately
    if (pathname === '/' || pathname === '') {
      const indexRequest = new Request(new URL('/index.html', url.origin).toString(), request);
      const indexResponse = await assets.fetch(indexRequest);
      
      if (indexResponse.status === 200) {
        return new Response(indexResponse.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          }
        });
      }
      return new Response('index.html not found in assets', { status: 404 });
    }
    
    // Try to fetch the requested asset
    const response = await assets.fetch(request);
    
    // If the asset exists, return it
    if (response.status === 200) {
      return response;
    }
    
    // Check if this is a request for a static file (has extension and not HTML)
    const isStaticFile = /\.\w+$/.test(pathname) && !pathname.endsWith('.html');
    
    // If it's a static file that doesn't exist, return 404
    if (isStaticFile) {
      return response;
    }
    
    // For all other routes without extensions, serve index.html (SPA fallback)
    const indexRequest = new Request(new URL('/index.html', url.origin).toString(), request);
    const indexResponse = await assets.fetch(indexRequest);
    
    if (indexResponse.status === 200) {
      return new Response(indexResponse.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        }
      });
    }
    
    return indexResponse;
  }
};
