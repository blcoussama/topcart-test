# Display dynamic store data with app proxies

App proxies take requests to Shopify links, and redirect them to external links. This allows you to fetch and display data on a merchant's store from an external source.

You don't need to set up app proxies before publishing an app. If you add an app proxy to an app after you've published it, then existing installations of the app are updated automatically. You can add or update a proxy URL at any time in the Partner Dashboard, and you don't need to update the URL in individual online stores.

## Add an app proxy

> **Note**: App proxies require the write_app_proxy access scope set in your app's configuration file. Learn more about how to manage access scopes.

1. From your Partner Dashboard, click Apps.

2. Click the name of your app.

3. Click Configuration.

4. Navigate to the App proxy section and click Set up.

5. In the App proxy section, select a prefix from the Subpath prefix drop-down list.

6. Enter a sub path in the Subpath field containing letters, numbers, underscores, and hyphens up to 30 characters. The value may not be admin, services, password, or login.

These settings determine which HTTP requests to Shopify are proxied to the proxy URL entered in the next step. For example, if the sub path prefix is apps, and the sub path is store-pickup, then any path in your online store after <https://example.myshopify.com/apps/store-pickup> will be proxied to the provided proxy URL.

7. Enter the URL of your proxy server in the Proxy URL field. This is the URL that will be proxied from the path that you entered in the previous step.

> **Tip**: Shopify does not recognize localhost or example.com as the proxy URL. If your app proxy contains those values, then it will return an error. If you want to expose your localhost to an app proxy while developing, then we recommend using a tunnelling service, such as Cloudflare tunnels.

8. When you're done, click Save and release.

> **Note**: If you're adding an app proxy using CLI-managed app configuration, you must run shopify app deploy to create the app proxy.

## Example

Consider the following app proxy configuration:

- Sub path prefix: apps
- Sub path: my-app-proxy
- Proxy URL: <https://my-app-proxy.com/app_proxy>

In this example, <https://example.myshopify.com/apps/my-app-proxy/app_path> forwards to the proxy URL at <https://my-app-proxy.com/app_proxy/app_path>. Subsequent child routes included in the request are forwarded as well, so <https://example.myshopify.com/apps/my-app-proxy/child-route> is forwarded to <https://my-app-proxy.com/app_proxy/child-route>.

## The merchant experience of an app proxy

Merchants can change the sub path or sub path prefix of app proxies. Merchants change the sub path prefix by toggling between a set of values provided by Shopify (/apps,/a,/community, or /tools). The combination of sub path prefix and sub path defines where the app proxy is accessed from a merchant's shop. Merchants can change this information to get a friendlier URL that appears to originate from the merchant's domain. The sub path doesn't affect the location of the proxy URL that you provide in the Proxy URL field.

## Handling proxy requests

The following examples show an app proxy definition:

- proxy URL: <https://proxy-domain.com/proxy>
- client IP: 123.123.123.123
- shared secret: hush

When the following HTTP request is sent from the client, Shopify forwards the request using the specified proxy URL:

```
GET /apps/awesome_reviews/extra/path/components?extra=1&extra=2 HTTP/1.1
Host: shop-domain.com
Cookie: csrftoken=01234456789abcdef0123456789abcde;
_session_id=1234456789abcdef0123456789abcdef;
_secure_session_id=234456789abcdef0123456789abcdef0
```

The forwarded request looks like the following:

```
GET /proxy/extra/path/components?extra=1&extra=2&shop=shop-name.myshopify.com&logged_in_customer_id=1&path_prefix=%2Fapps%2Fawesome_reviews&timestamp=1317327555&signature=4c68c8624d737112c91818c11017d24d334b524cb5c2b8ba08daa056f7395ddb HTTP/1.1
Host: proxy-domain.com
X-Forwarded-For: 123.123.123.123
X-Forwarded-Host: shop-domain.com
```

> **Note**: App proxies don't support cookies because the app is accessed through the shop's domain. Shopify strips the Cookie header from the request, and the Set-Cookie header from the response. Other headers are also stripped due to security concerns. To learn more, refer to Disallowed headers.

The forwarded request adds the following parameters:

- **shop**: The myshopify.com domain for the shop.
- **path_prefix**: The proxy sub-path prefix at which the shop was accessed. In this case, it's /apps/awesome_reviews, which was replaced in the forwarded request URL with the proxy application's Proxy URL.
- **timestamp**: The time in seconds since midnight of January 1, 1970 UTC.
- **signature**: A hexadecimal encoded SHA-256 HMAC of the other parameters, split on the "&" character, that is used to verify that the request was sent by Shopify. The signature is unencoded, sorted, concatenated and uses the application's shared secret as the HMAC key.
- **logged_in_customer_id**: The ID of the logged-in customer. If no customer is logged in, then this value is empty.

> **Note**: You shouldn't assume that the parameters that are listed above are the only parameters that'll be used. Shopify updates functionality often, so new parameters can be introduced. The Calculate a digital signature example demonstrates a maintainable way to handle parameters.

The forwarded request also adds the following headers:

- **X-Forwarded-Host**: The domain name of the client's request.
- **X-Forwarded-For**: The client IP address.

Both the request method and request body are forwarded, meaning that content from the form submission and AJAX requests can be used in the proxy application. If this is the case, then the URL still contains the query parameters added by the proxy, such as shop, logged_in_customer_id, path_prefix, timestamp, and signature, even when the body also contains URL encoded parameters.

## Calculate a digital signature

To verify that the request came from Shopify, you need to compute the HMAC digest according to the SHA-256 hash function and compare it to the value in the signature property. If the values match, then the request was sent from Shopify.

The following examples show how to calculate the digital signature when a customer is logged in and the logged_in_customer_id parameter is populated, and when no customer is logged in and the logged_in_customer_id is empty.

### Ruby file

#### Customer logged in

```ruby
require 'openssl'
require 'rack/utils'
SHARED_SECRET = 'hush'

# Use request.query_string in rails
query_string = "extra=1&extra=2&shop=shop-name.myshopify.com&logged_in_customer_id=1&path_prefix=%2Fapps%2Fawesome_reviews&timestamp=1317327555&signature=4c68c8624d737112c91818c11017d24d334b524cb5c2b8ba08daa056f7395ddb"

query_hash = Rack::Utils.parse_query(query_string)
# => {
#   "extra" => ["1", "2"],
#   "shop" => "shop-name.myshopify.com",
#   "logged_in_customer_id" => 1,
#   "path_prefix" => "/apps/awesome_reviews",
#   "timestamp" => "1317327555",
#   "signature" => "4c68c8624d737112c91818c11017d24d334b524cb5c2b8ba08daa056f7395ddb",
# }

# Remove and save the "signature" entry
signature = query_hash.delete("signature")

sorted_params = query_hash.collect{ |k, v| "#{k}=#{Array(v).join(',')}" }.sort.join
# => "extra=1,2logged_in_customer_id=1path_prefix=/apps/awesome_reviewsshop=shop-name.myshopify.comtimestamp=1317327555"

calculated_signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), SHARED_SECRET, sorted_params)
raise 'Invalid signature' unless ActiveSupport::SecurityUtils.secure_compare(signature, calculated_signature)
```

#### No customer logged in

```ruby
require 'openssl'
require 'rack/utils'
SHARED_SECRET = 'hush'

# Use request.query_string in rails
query_string = "extra=1&extra=2&shop=shop-name.myshopify.com&logged_in_customer_id=&path_prefix=%2Fapps%2Fawesome_reviews&timestamp=1317327555&signature=e072b6d7e6622d85912a5214b860d3100dc1e73d9bc29f43796ac8c9ff8093cb"

query_hash = Rack::Utils.parse_query(query_string)
# => {
#   "extra" => ["1", "2"],
#   "shop" => "shop-name.myshopify.com",
#   "logged_in_customer_id" => "",
#   "path_prefix" => "/apps/awesome_reviews",
#   "timestamp" => "1317327555",
#   "signature" => "e072b6d7e6622d85912a5214b860d3100dc1e73d9bc29f43796ac8c9ff8093cb",
# }

# Remove and save the "signature" entry
signature = query_hash.delete("signature")

sorted_params = query_hash.collect{ |k, v| "#{k}=#{Array(v).join(',')}" }.sort.join
# => "extra=1,2logged_in_customer_id=path_prefix=/apps/awesome_reviewsshop=shop-name.myshopify.comtimestamp=1317327555"

calculated_signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), SHARED_SECRET, sorted_params)
raise 'Invalid signature' unless ActiveSupport::SecurityUtils.secure_compare(signature, calculated_signature)
```

### Caution

The signature check only guarantees that the request hasn't been tampered with. The app must also verify that the logged_in_customer_id query parameter matches the customer that's associated with the requested data. This ensures that the app returns only data owned by the authenticated user.

## Disallowed headers

Due to security concerns, the following headers are stripped from app proxy responses:

- accept-patch
- accept-ranges
- connection
- cookie
- date
- delta-base
- im
- p3p
- pragma
- preference-applied
- proxy-authenticate
- public-key-pins
- server
- service-worker-allowed
- set-cookie
- trailer
- tk
- warning
- x-powered-by

## Liquid response

App proxies support Liquid, Shopify's template language. An app proxy response that contains Liquid will be rendered with store data into HTML like it was part of the store's theme.

If the HTTP response from the proxy URL has Content-Type: application/liquid set in its headers, then Shopify renders any Liquid code in the request body in the context of the shop using the shop's theme. Otherwise, the response is returned directly to the client. Also, any 30x redirects are followed.
