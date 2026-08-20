export async function onRequest(context) {
  const { request, params, env } = context;
  const API_URL = env.API_URL;
  const path = params.path ? params.path.join('/') : '';
  const url = new URL(request.url);
  const targetUrl = `${API_URL}/${path}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');

  const proxyRequest = new Request(targetUrl, {
    method:  request.method,
    headers,
    body:    ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    redirect: 'follow',
  });

  const response = await fetch(proxyRequest);

  return response;
}
