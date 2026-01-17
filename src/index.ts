export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    
    // Try to fetch the requested asset
    const assetResponse = await env.ASSETS.fetch(request);
    
    // If the asset exists (status 200), return it
    if (assetResponse.status === 200) {
      return assetResponse;
    }
    
    // For any other route, serve index.html (SPA routing)
    const indexRequest = new Request(new URL('/index.html', request.url), request);
    return env.ASSETS.fetch(indexRequest);
  }
};
