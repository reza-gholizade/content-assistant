export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Get the ASSETS binding (Cloudflare automatically creates this when assets are configured)
    const assets = env.ASSETS;
    
    if (!assets) {
      return new Response('ASSETS binding not found', { status: 500 });
    }
    
    // Try to fetch the requested asset
    let response = await assets.fetch(request);
    
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
    
    // For all HTML routes or paths without extensions, serve index.html (SPA fallback)
    const indexUrl = new URL('/index.html', url.origin);
    return assets.fetch(new Request(indexUrl, request));
  }
};
