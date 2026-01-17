export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Get the ASSETS binding (Cloudflare automatically creates this when assets are configured)
    const assets = env.ASSETS;
    
    if (!assets) {
      return new Response('ASSETS binding not found', { status: 500 });
    }
    
    // Try to fetch the requested asset first
    let response = await assets.fetch(request);
    
    // If the asset exists (200), return it with proper headers
    if (response.status === 200) {
      // Clone response to modify headers if needed
      const newResponse = new Response(response.body, response);
      
      // Set CORS headers if needed
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      
      // Set proper content type for HTML
      if (pathname.endsWith('.html') || pathname === '/') {
        newResponse.headers.set('Content-Type', 'text/html; charset=utf-8');
      }
      
      return newResponse;
    }
    
    // Check if this is a request for a static file (has extension and not HTML)
    const isStaticFile = /\.\w+$/.test(pathname) && !pathname.endsWith('.html');
    
    // If it's a static file that doesn't exist, return 404
    if (isStaticFile) {
      return response;
    }
    
    // For all other routes (including root), serve index.html (SPA fallback)
    const indexUrl = new URL('/index.html', url.origin);
    const indexRequest = new Request(indexUrl.toString(), {
      method: request.method,
      headers: request.headers,
    });
    
    const indexResponse = await assets.fetch(indexRequest);
    
    // Return index.html with proper headers
    if (indexResponse.status === 200) {
      const htmlResponse = new Response(indexResponse.body, indexResponse);
      htmlResponse.headers.set('Content-Type', 'text/html; charset=utf-8');
      htmlResponse.headers.set('Access-Control-Allow-Origin', '*');
      return htmlResponse;
    }
    
    return indexResponse;
  }
};
