# Manage media for products

You can use the GraphQL Admin API to manage the various types of media associated with products. You can also use the Storefront API to retrieve a product's media and display it on a custom storefront. This guide explains the different types of product media, and how to use Shopify APIs to work with them.

## App requirements

- Your app can make authenticated requests to the GraphQL Admin API and Storefront API.
- Your app has the read_products and write_products access scopes. Learn how to configure your access scopes using Shopify CLI.
- You're performing actions on product media that are supported by the API you're working with:
  - GraphQL Admin API: Supports uploading media, adding media to a product, retrieving media, and deleting media
  - Storefront API: Only supports retrieving media
- You're working within the constraints of the plan-based limits for product media.

There's a limit to the number of Shopify-hosted videos and 3D models that a store can have. The limit depends on the Shopify plan that the store is on:

- Basic Shopify: 250
- Shopify: 1,000
- Advanced Shopify: 5,000
- Shopify Plus: Contact Plus Support

There's also a limit to the total storage available per shop. The limit depends on the Shopify plan that the store is on:

- Basic Shopify: 100GB
- Shopify: 300GB
- Advanced Shopify: 300GB
- Shopify Plus: 300GB, contact Plus Support if you need more storage.

## Step 1: Upload media to Shopify

A product can have different media types:

- **MediaImage**: An image in one of the following formats: PNG, GIF, or JPG. The maximum image size is 4472 x 4472 px, or 20 megapixels. For square images, 2048 x 2048 px looks best.
- **Video**: An MP4 video that's hosted by Shopify. The video runtime must be 10 minutes or shorter. The maximum file size is 1 GB.
- **ExternalVideo**: A video that's hosted on YouTube or Vimeo, specified by its embed URL.
- **Model3d**: A 3D model provided in GLB or USDZ format. The asset can be retrieved in GLB and USDZ formats. The file size must be 500 MB or smaller.

> **Note**: Only the GraphQL Admin API and Storefront API supports working with all types of product media.

Before you add a piece of media to a product, you can upload it and host it on Shopify. There are two parts to uploading an asset to Shopify:

1. Generate the upload URL and parameters.
2. Upload the asset.

## Generate the upload URL and parameters

You can use the stagedUploadsCreate mutation to generate the values that you need to authenticate multiple uploads. The mutation returns the stagedTargets array. Each staged target has the following properties:

- **params**: The parameters that you use to authenticate an upload request
- **url**: The URL where you can upload the media asset
- **resourceUrl**: The URL that you pass to productCreateMedia in the originalSource field after the asset has been uploaded

The mutation accepts an input of type stagedUploadInput, which has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| resource | StagedUploadTargetGenerateUploadResource | Specifies the resource type to upload. Valid media values: VIDEO, MODEL_3D, IMAGE. |
| filename | String | The name of the file to upload. |
| mimeType | String | The Media type of the file to upload. Use one of the following values:<br>video/mp4<br>video/quicktime<br>image/png<br>image/gif<br>image/jpeg<br>model/gltf-binary<br>model/vnd.usdz+zip |
| httpMethod | StagedUploadHttpMethodType | The HTTP method to be used by the staged upload. Valid values: POST (all media types), PUT (images only). |
| fileSize | UnsignedInt64 | The size in bytes of the file to upload. |

The following example uses the stagedUploadsCreate mutation to generate the upload values required to upload an MP4 video and a 3D model.

POST https://{shop}.myshopify.com/api/{api_version}/graphql.json

### GraphQL mutation

```graphql
mutation generateStagedUploads {
  stagedUploadsCreate(input: [
    {
      filename: "watches_comparison.mp4",
      mimeType: "video/mp4",
      resource: VIDEO,
      fileSize: "899765"
    },
    {
      filename: "another_watch.glb",
      mimeType: "model/gltf-binary",
      resource: MODEL_3D,
      fileSize: "456"
    }
  ]) {
    stagedTargets {
      url
      resourceUrl
      parameters {
        name
        value
      }
    }
    userErrors {
      field, message
    }
  }
}
```

### JSON response

```json
{
  "data": {
    "stagedUploadsCreate": {
      "stagedTargets": [
        {
          "url": "https:\/\/shopify-video-production-core-originals.storage.googleapis.com",
          "resourceUrl": "https:\/\/shopify-video-production-core-originals.storage.googleapis.com?external_video_id=8490719",
          "parameters": [
            {
              "name": "GoogleAccessId",
              "value": "video-production@video-production-225115.iam.gserviceaccount.com"
            },
            {
              "name": "key",
              "value": "c\/o\/v\/2e285673bb044aa1a174f813a2e953cf.mp4"
            },
            {
              "name": "policy",
              "value": "eyJjb25kaXRpb25zIjpbWyJlcSIsIiRidWNrZXQiLCJzaG9waWZ5LXZpZGVvLXByb2R1Y3Rpb24tY29yZS1vcmlnaW5hbHMiXSxbImVxIiwiJGtleSIsImMvby92LzJlMjg1NjczYmIwNDRhYTFhMTc0ZjgxM2EyZTk1M2NmLm1wNCJdLFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDg5OTc2NSw4OTk3NjVdXSwiZXhwaXJhdGlvbiI6IjIwMjItMDctMjlUMDE6NTE6MzVaIn0="
            },
            {
              "name": "signature",
              "value": "I3b9kpOha6DjDYk+zHIJ3XF1Q8JBa6VVNJ+dOQje\/F\/Nnzry8d97CiI5j3AI+5c1\/ZCkpw9MRcOJx4DK0PDJ8k\/KWJ1j9x8YxuvT87KQTy\/hiacpCGBKnx5qGowUHA\/yNFsFZ4S+2oNsyMCHNHrYRxk0F56i3aSD2mTA28eusH1Xfa0d7wnTQbS8CV2H8IpPLFHUsxBWPM1VnKCFHR0BHy2IjEzYEvyl\/ei9IfBCr1CL5JxtYwIzGe5YS2zYqE60gGu9xGcA57SVwqTsn5wVEi+sGmSgwlgGt8r526u+I40VvRrRpuD3zb7yxEL0C\/LJpgIcpTd61Yhu8MeKquqzPA=="
            }
          ]
        },
        {
          "url": "https:\/\/storage.googleapis.com\/threed-models-production\/models\/1495b0cb3bcee78e\/another_watch.glb?external_model3d_id=bW9kZWwzZC0yNjIzMTA=",
          "resourceUrl": "https:\/\/storage.googleapis.com\/threed-models-production\/models\/1495b0cb3bcee78e\/another_watch.glb?external_model3d_id=bW9kZWwzZC0yNjIzMTA=",
          "parameters": [
            {
              "name": "GoogleAccessId",
              "value": "threed-model-service-prod@threed-model-service.iam.gserviceaccount.com"
            },
            {
              "name": "key",
              "value": "models\/1495b0cb3bcee78e\/another_watch.glb"
            },
            {
              "name": "policy",
              "value": "eyJleHBpcmF0aW9uIjoiMjAyMi0wNy0yOVQwMTowNjozNloiLCJjb25kaXRpb25zIjpbWyJlcSIsIiRidWNrZXQiLCJ0aHJlZWQtbW9kZWxzLXByb2R1Y3Rpb24iXSxbImVxIiwiJGtleSIsIm1vZGVscy8xNDk1YjBjYjNiY2VlNzhlL2Fub3RoZXJfd2F0Y2guZ2xiIl0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsNDU2LDQ1Nl1dfQ=="
            },
            {
              "name": "signature",
              "value": "HM7Vu8fPcE9pB9NzJee7AMxD612SVRT2bAX+zO+btvoEoSNlPAUanmn4dSr1Xjzv+\/iGQgeGShEFkZSnqFiKaRyiiwS6TQKANkE2TbhjFAKS3hfGSTmW4Hq9rRsFOLzQ4a5umda+mugsZ+pT5GPw1amXgD7J+P9sONxrukgnyftyucUOkeBWDTBJrx3b02A9CvFb4md787fuB6qG4WRDJ0q317DObqW1eQ+ACor5mADlEZkGLtNgVhbIhA1JPY+06kDPpmQmBxd4RfrQngzBc36tKUwBkOVPLSwNRo7iMs2nMcRWGjJ9naBfKwrPkYjbe6\/npKrq9BKTyeaEIf\/fmQ=="
            }
          ]
        }
      ],
      "userErrors": []
    }
  }
}
```

## Upload the asset

After generating the parameters and URL for an upload, you need to upload the asset by using a POST or PUT request. The request is formatted differently depending on the media type and the HTTP method that you're using.

### 3D models: POST request

Use a multipart form, and include all parameters as form inputs in the request body:

```bash
curl -v \
-F "GoogleAccessId=threed-model-service-prod@threed-model-service.iam.gserviceaccount.com" \
-F "key=models/1495b0cb3bcee78e/another_watch.glb" \
-F "policy=eyJleHBpcmF0aW9uIjoiMjAyMi0wNy0yOVQwMTowNjozNloiLCJjb25kaXRpb25zIjpbWyJlcSIsIiRidWNrZXQiLCJ0aHJlZWQtbW9kZWxzLXByb2R1Y3Rpb24iXSxbImVxIiwiJGtleSIsIm1vZGVscy8xNDk1YjBjYjNiY2VlNzhlL2Fub3RoZXJfd2F0Y2guZ2xiIl0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsNDU2LDQ1Nl1dfQ==" \
-F "signature=HM7Vu8fPcE9pB9NzJee7AMxD612SVRT2bAX+zO+btvoEoSNlPAUanmn4dSr1Xjzv+\/iGQgeGShEFkZSnqFiKaRyiiwS6TQKANkE2TbhjFAKS3hfGSTmW4Hq9rRsFOLzQ4a5umda+mugsZ+pT5GPw1amXgD7J+P9sONxrukgnyftyucUOkeBWDTBJrx3b02A9CvFb4md787fuB6qG4WRDJ0q317DObqW1eQ+ACor5mADlEZkGLtNgVhbIhA1JPY+06kDPpmQmBxd4RfrQngzBc36tKUwBkOVPLSwNRo7iMs2nMcRWGjJ9naBfKwrPkYjbe6\/npKrq9BKTyeaEIf\/fmQ==" \
-F "file=@/Users/shopifyemployee/another_watch.glb" \
"https://storage.googleapis.com/threed-models-production/models/1495b0cb3bcee78e/another_watch.glb?external_model3d_id=bW9kZWwzZC0yNjIzMTA="
```

### Videos: POST request

Use a multipart form, and include all parameters as form inputs in the request body:

```bash
curl -v \
-F "GoogleAccessId=video-production@video-production-225115.iam.gserviceaccount.com" \
-F "key=c/o/v/123bbb4321f4d40a101mi1fd3c32aa7.mp4" \
-F "policy=eyJjb25kaXRpb25zIjpbWyJlcSIsIiRidWNrZXQiLCJzaG9waWZ5LXZpZGVvLWRldmVsb3BtZW50LWdlbmVyYWwtb3JpZ2luYWxzIl0sWyJlcSIsIiRrZXkiLCJkZXYvby92L2Y5MzdlZmM0MDExZjRkNDBhMTAxYWY4ZWQzYzU2Y2U3Lm1wNCJdLFsikj23423kj123kjahsdbaxNSw4NTA2MTVdXSwiZXhwaXJhdGlvbiI6IjIwMjItMDgtMDFUMjM6NTM6MjNaIn0=" \
-F "signature=vD7N/vHO4MS0EpG,ms@DSF@sfsdlkasn21D5+AuQXP2naBXU1mTr7K9EelXXufl/52lDvzgxJmQvgpUWVZ9tmNtxMjEj7uiL7dUzTs1vxQC7G/fWODk43bzX54Q6Xe2+BgBNp+fK4p9zM51+XZS9SrHcoTVaoqmGdYSWtu+ABOKRObQAf5hVm6AjKphB0hqWHxfLyk+/9MCnpXjdJzUrzNDnOAMVQYV7sBBNXS123123DuLQDn7lH8CFImsC3AVnB4nGoZpV2JhPko0teoogw7umfXrRZYB8NeTr2bOdnsFzJYdlXZvhbgUW3BjDQ==" \
-F "file=@/Users/shopifyemployee/watches_comparison.mp4" \
"https://shopify-video-production-core-originals.storage.googleapis.com"
```

> **Tip**: You can send API requests that include form data by using clients API like Postman and Insomnia.

### Images: POST request

Use a multipart form, and include all parameters as form inputs in the request body:

```bash
curl -v \
-F "Content-Type=image/png" \
-F "success_action_status=201" \
-F "acl=private" \
-F "key=tmp/45732462614/products/7156c27e-0331-4bd0-b758-f345afaa90d1/watches_comparison.png" \
-F "x-goog-date=20221024T181157Z" \
-F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/20221024/auto/storage/goog4_request" \
-F "x-goog-algorithm=GOOG4-RSA-SHA256" \
-F "x-goog-signature=039cb87e2787029b56f498beb2deb3b9c34d96da642c1955f79225793f853760906abbd894933c5b434899d315da13956b1f67d8be54f470571d7ac1487621766a2697dfb8699c57d4e67a8b36ea993fde0f888b8d1c8bd3f33539d8583936bc13f9001ea3e6d401de6ad7ad2ae52d722073caf250340d5b0e92032d7ad9e0ec560848b55ec0f943595578a1d6cae53cd222d719acb363ba2c825e3506a52b545dec5be57074f8b1b0d58298a0b4311016752f4cdb955b89508376c38f8b2755fce2423acb3f592a6f240a21d8d2f51c5f740a61a40ca54769a736d73418253ecdf685e15cfaf7284e6e4d5a784a63d0569a9c0cffb660028f659e68a68fb80e" \
-F "policy=eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJpbWFnZVwvcG5nIn0seyJzdWNjZXNzX2FjdGlvbl9zdGF0dXMiOiIyMDEifSx7ImFjbCI6InByaXZhdGUifSxbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwxLDIwOTcxNTIwXSx7ImJ1Y2tldCI6InNob3BpZnktc3RhZ2VkLXVwbG9hZHMifSx7ImtleSI6InRtcFwvZ2NzXC80NTczMjQ2MjYxNFwvcHJvZHVjdHNcLzcxNTZjMjdlLTAzMzEtNGJkMC1iNzU4LWYzNDVhZmFhOTBkMVwvd2F0Y2hlc19jb21wYXJpc29uLnBuZyJ9LHsieC1nb29nLWRhdGUiOiIyMDIyMTAyNFQxODExNTdaIn0seyJ4LWdvb2ctY3JlZGVudGlhbCI6Im1lcmNoYW50LWFzc2V0c0BzaG9waWZ5LXRpZXJzLmlhbS5nc2VydmljZWFjY291bnQuY29tXC8yMDIyMTAyNFwvYXV0b1wvc3RvcmFnZVwvZ29vZzRfcmVxdWVzdCJ9LHsieC1nb29nLWFsZ29yaXRobSI6IkdPT0c0LVJTQS1TSEEyNTYifV0sImV4cGlyYXRpb24iOiIyMDIyLTEwLTI1VDE4OjExOjU3WiJ9" \
-F "file=@/Users/shopifyemployee/Desktop/watches_comparison.png" \
 "https://shopify-staged-uploads.storage.googleapis.com/"
```

### Images: PUT request

Include the parameters as request headers. Additional parameters are already included in the URL:

```bash
curl -X PUT -T /Users/shopifyemployee/Desktop/watches_comparison.png \
-H 'content_type:image/png' \
-H 'acl:private' \
"https://shopify-staged-uploads.storage.googleapis.com/tmp/45732462614/products/4da01e43-76ff-4014-be67-754bc154494d/watches_comparison.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=merchant-assets%40shopify-tiers.iam.gserviceaccount.com%2F20221024%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221024T181931Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=5c27c9a5b22496b4e8ef8918f028667a6ea13f6c1970b89e587a41a269d7dcfc1611c2afe3e5f36048b9d1e94b4b599d51b2f00d3d33d71483e0d35e03140911450e837f2e6f9d482d3546f137874fdac4f7d0d9e9906eee553d7059f7c8b2b009678beee9fa69361aa1a646b07ba7fddc6f33eae932e7cfa56deb4e9c9c295d883910143099e6bc2811c2f41e1cb752bd8c61a3e15efe5311b7fbf79dc76df372bc5870ea4a31f9bc01f758f78f704d1edfa3cf72b2768557a84a93a471ad93d6fff7155cbac549dd4aa00aecb60e02323f058f31264e025a7a3123a17fa55d64413ee72089c23686664eb5c421625398d6246e152d2a4eab871a5e5c075e43"
```

## Step 2: Add media to a product

You can add new media to a product by using the productCreateMedia mutation. The mutation takes two arguments:

- **productId**: The ID of the product that you're adding media to.
- **media**: An array of CreateMediaInput objects.

For each CreateMediaInput object, include the following fields:

### CreateMediaInput object fields

| Field | Type | Description |
|-------|------|-------------|
| originalSource | String | The original source of the media object. Can be an external URL for images, YouTube videos, and Vimeo videos, or an upload URL for images, videos, and 3D models hosted by Shopify. For assets hosted by Shopify, use the resourceUrl value returned by the stagedUploadsCreate mutation. |
| alt | String | The alt text associated to the media. |
| mediaContentType | MediaContentType | The content type of the asset that you're adding. Valid values: IMAGE, VIDEO, EXTERNAL_VIDEO, MODEL_3D. |

> **Note**: An app can create a maximum of 1,000 video objects per store in a week. The count is reset seven days after the first Video object is created. If your app reaches the 1,000 limit before seven days, then your app is throttled and you receive a VIDEO_THROTTLE_EXCEEDED error code when you try to create Video objects for products. Wait for the count to reset, and then try again.

The following example adds a Shopify-hosted video to a product:

POST https://{shop}.myshopify.com/api/{api_version}/graphql.json

### GraphQL mutation

```graphql
mutation createProductMedia {
    productCreateMedia(productId: "gid://shopify/Product/1", media: [
      {
        originalSource: "https://storage.googleapis.com/shopify-video-production-core-originals/c/o/v/af64d230f6bc40cbba40a87be950a1a2.mp4?external_video_id=1730",
        alt: "Comparison video showing the different models of watches.",
        mediaContentType: VIDEO
      }
    ]) {
      media {
        ... fieldsForMediaTypes
        mediaErrors {
          code
          details
          message
        }
        mediaWarnings {
          code
          message
        }
      }
      product {
        id
      }
      mediaUserErrors {
        code
        field
        message
      }
    }
  }

  fragment fieldsForMediaTypes on Media {
    alt
    mediaContentType
    preview {
      image {
        id
      }
    }
    status
    ... on Video {
      id
      sources {
        format
        height
        mimeType
        url
        width
      }
    }
    ... on ExternalVideo {
      id
      host
      originUrl
    }
    ... on Model3d {
      sources {
        format
        mimeType
        url
      }
```

### JSON response

```json
{
   "data": {
    "productCreateMedia": {
     "media": [
      {
       "alt": "Comparison video showing the different models of watches.",
       "mediaContentType": "VIDEO",
       "preview": {
        "image": null
       },
       "status": "UPLOADED",
       "id": "gid://shopify/Video/1",
       "sources": [],
       "mediaErrors": [],
       "mediaWarnings": []
      }
     ],
     "product": {
      "id": "gid://shopify/Product/1"
     },
     "mediaUserErrors": []
    }
   }
  }
```

## Step 3: Retrieve media objects

You can retrieve a product's media of all types by using the media connection on the Product type. The connection returns nodes that implement the Media interface.

The media connection includes the mediaContentType field, which you can use to check the media type of each node. Because each media type can return different fields, you can specify the return fields for each type by using fragments:

POST https://{shop}.myshopify.com/api/{api_version}/graphql.json

### GraphQL query

```graphql
{
    product(id:"gid://shopify/Product/1") {
      title
      media(first:5) {
        edges {
          node {
            ... fieldsForMediaTypes
          }
        }
      }
    }
  }

  fragment fieldsForMediaTypes on Media {
    alt
    mediaContentType
    preview {
      image {
        id
        altText
        url
      }
    }
    status
    ... on Video {
      id
      sources {
        format
        height
        mimeType
        url
        width
      }
      originalSource {
        format
        height
        mimeType
        url
        width
      }
    }
    ... on ExternalVideo {
      id
      host
      embeddedUrl
    }
    ... on Model3d {
      sources {
        format
        mimeType
        url
      }
      originalSource {
        format
        mimeType
        url
      }
    }
    ... on MediaImage {
      id
      image {
        altText
```

### JSON response

```json
{
    "data": {
      "product": {
        "title": "Polaris Watch",
        "media": {
          "edges": [
            {
              "node": {
                "alt": "Comparison video showing the different models of watches.",
                "mediaContentType": "VIDEO",
                "preview": {
                  "image": {
                    "id": "gid://shopify/Image/1",
                    "altText": "Comparison video showing the different models of watches.",
                    "url": "https://cdn.shopify.com/s/files/1/1768/1717/products/31f1438669864f4f91847f07e39e3835.jpg?v=1234567890"
                  }
                },
                "status": "READY",
                "id": "gid://shopify/Video/1",
                "sources": [
                  {
                    "format": "mp4",
                    "height": 360,
                    "mimeType": "video/mp4",
                    "url": "https://videos.shopifycdn.com/c/vp/2a82811738ca41e7a508e6744028d169/SD-360p.mp4?Expires=1560956269&KeyName=core-signing-key-1&Signature=MYq_eEWGB-2Ww-oN58j-TbxwDYw=",
                    "width": 640
                  }
                ]
              }
            },
            {
              "node": {
                "alt": "Comparison video showing the different models of watches.",
                "mediaContentType": "EXTERNAL_VIDEO",
                "preview": {
                  "image": {
                    "id": "gid://shopify/Image/2",
                    "altText": "Comparison video showing the different models of watches.",
                    "url": "https://cdn.shopify.com/s/files/1/1768/1717/products/31f1438669864f4f91847f07e39e3835.jpg?v=2234567890"
                  }
                },
                "status": "READY",
                "id": "gid://shopify/ExternalVideo/1",
                "host": "YOUTUBE",
                "embeddedUrl": "https://youtu.be/z7RLjNOael0"
              }
            }
          ]
        }
      }
    }
  }
```

## Retrieve product media by using the Storefront API

With the Storefront API, use the media field on the Product type to query for a product's media. Use a fragment to specify the fields that you want to return for each possible media type.

POST https://{shop}.myshopify.com/api/{api_version}/graphql.json

### GraphQL query

```graphql
{
    node(id: "gid://shopify/Product/1") {
      ...on Product {
        id
          media(first: 10) {
          edges {
            node {
              mediaContentType
              alt
              ...mediaFieldsByType
            }
          }
        }
      }
    }
  }

  fragment mediaFieldsByType on Media {
    ...on ExternalVideo {
      id
      host
    originUrl
    }
    ...on MediaImage {
      image {
        url
      }
    }
    ...on Model3d {
      sources {
        url
        mimeType
        format
        filesize
      }
    }
    ...on Video {
      sources {
        url
        mimeType
        format
        height
        width
      }
    }
  }
```

### JSON response

```json
{
    "data": {
      "node": {
        "id": "gid://shopify/Product/1",
        "media": {
          "edges": [
            {
              "node": {
                "mediaContentType": "VIDEO",
                "alt": "Comparison video showing the different models of watches.",
                "sources": [
                  {
                    "url": "https://videos.shopifycdn.com/c/vp/2a82811738ca41e7a508e6744028d169/SD-360p.mp4?Expires=1575744400&KeyName=core-signing-key-1&Signature=OPKELzhY-kYTx9QH9x6NJA9IqnI=",
                    "mimeType": "video/mp4",
                    "format": "mp4",
                    "height": 360,
                    "width": 640
                  }
                ]
              }
            },
            {
              "node": {
                "mediaContentType": "IMAGE",
                "alt": "Polaris watch",
                "image": {
                  "url": "https://cdn.shopify.com/s/files/1/1768/1717/products/IGQ.png?v=1560528103"
                }
              }
            }
          ]
        }
      }
    }
  }
```

## Step 4: Check whether media is ready to display

When you add a piece of media to a product, Shopify needs to process the media before it can be displayed.

The Media interface includes the status field, which you can use to check whether the media has been processed. The status field can return different values.

## Step 5: Update product media

You can use the productUpdateMedia mutation to update a piece of media associated with a product. As part of the mutation input, include the following arguments:

- **productId**: The ID of the product that the media belongs to.
- **media**: An array of media changes to apply.

You can change a media item's alt text or preview image URL. Include the media's ID to identify the media you want to update. Identify the media to update by its ID. For example, the GraphQL variable below updates the alt text of the MediaImage with ID gid://shopify/MediaImage/42729528:

```json
media: [
  {
    id: "gid://shopify/MediaImage/42729528",
    alt: "Some new alt text."
  }
]
```

The following example shows how to use the productUpdateMedia mutation to update the alt text of a piece of media. The example uses a JSON variable to provide the media changes, and a fragment to select the return fields based on the media type.

POST https://{shop}.myshopify.com/api/{api_version}/graphql.json

### GraphQL mutation

```graphql
mutation updateProductMedia {
  productUpdateMedia(
    productId: "gid://shopify/Product/42729528",
    media: [
    {
      id: "gid://shopify/MediaImage/1",
      alt: "Man wearing Polaris watch."
    }
  ]
  ) {
    media {
      alt
      mediaContentType
      ... mediaFieldsByType
    }
    mediaUserErrors {
      field
      message
    }
  }
}

fragment mediaFieldsByType on Media {
  ...on ExternalVideo {
    id
    host
    originUrl
  }
  ...on MediaImage {
    id
    image {
      url
    }
  }
  ...on Model3d {
    id
    sources {
      url
      mimeType
      format
      filesize
    }
  }
  ...on Video {
    id
    sources {
      url
      mimeType
      format
      height
      width
    }
  }
}
```

### JSON response

```json
{
  "data": {
    "productUpdateMedia": {
      "media": [
        {
          "alt": "Man wearing Polaris watch.",
          "mediaContentType": "IMAGE",
          "id": "gid://shopify/MediaImage/42729528",
          "image": {
            "url": "https://cdn.shopify.com/s/files/1/1768/1717/products/StockSnap_9NPZZJCWW3_copy.jpg?v=1566862515"
          }
        }
      ],
      "mediaUserErrors": []
    }
  }
}
```

## Step 6: Reorder media objects

You can reorder a product's media by using the productReorderMedia mutation. The mutation accepts two arguments:

- **id**: The ID of the product whose media you're reordering.
- **moves**: An array of tuples consisting of a media object's ID and its new position in the list. For example, the following array would move the media objects to the front of the product's media list:

```json
[
    {
      id: "gid://shopify/MediaImage/37"
      newPosition: "0"
    },
    {
      id: "gid://shopify/Video/2",
      newPosition: "1"
    }
]
```

The following example adjusts the order of a products first three media assets:

POST https://{shop}.myshopify.com/api/{api_version}/graphql.json

### GraphQL mutation

```graphql
mutation reorderProductMedia {
  productReorderMedia(
    id: "gid://shopify/Product/1",
    moves: [
    {
      id: "gid://shopify/MediaImage/37",
      newPosition: "0"
    },
    {
      id: "gid://shopify/Video/2",
      newPosition: "1"
    },
    {
      id: "gid://shopify/ExternalVideo/1",
      newPosition: "2"
    }
  ]) {
    job {
      id
      done
    }
    mediaUserErrors {
      code
      field
      message
    }
  }
}
```

### JSON response

```json
{
  "data": {
    "productReorderMedia": {
      "job": {
        "id": "gid:\/\/shopify\/Job\/17366d70-740a-4048-a102-82267e30c92a",
        "done": false
      },
      "mediaUserErrors": []
    }
  }
}
```

You can use the returned ID for the job to poll for when the reordering job is complete.

## Step 7: Delete media objects (optional)

To delete media assets from a product, use the productDeleteMedia mutation. The mutation accepts two arguments:

- **productId**: The ID of the product whose media you're deleting.
- **mediaIds**: An array of IDs for the media that you're deleting.

The following example deletes two media assets from a product:

POST https://{shop}.myshopify.com/api/{api_version}/graphql.json

### GraphQL mutation

```graphql
mutation deleteProductMedia {
  productDeleteMedia(
    productId: "gid://shopify/Product/1",
    mediaIds: [
      "gid://shopify/ExternalVideo/1",
      "gid://shopify/Video/2"
    ]) {
    deletedMediaIds
    product {
      id
    }
    mediaUserErrors {
      code
      field
      message
    }
  }
}
```

### JSON response

```json
{
  "data": {
    "productDeleteMedia": {
      "deletedMediaIds": [
        "gid://shopify/ExternalVideo/1",
        "gid://shopify/Video/2"
      ],
      "product": {
        "id": "gid://shopify/Product/1"
      },
      "mediaUserErrors": []
    }
  }
}
```

## Media file requirements

The following sections provide file format and size requirements and specify any file limitations.

## Image file requirements

| Attribute | Requirement |
|-----------|-------------|
| File size | Maximum of 20 MB (megabytes) |
| Resolution | Maximum of 20 MP (megapixels) |
| Aspect ratio | Between 100:1 and 1:100 |
| File formats | JPEG, PNG, WEBP, HEIC, and GIF |
| File names | File names may contain letters, numbers, spaces, and symbols, but must not begin with a period . |

## Video file requirements

| Attribute | Requirement |
|-----------|-------------|
| File size | Maximum of 1 GB (gigabyte) |
| Resolution | Maximum resolution of UHD |
| Video length | Maximum video length of 10 minutes |
| File formats | MOV, MP4, and WEBM |
| Minimum width and height | 100 pixels |
| Maximum width and height | 4096 pixels |
| Maximum frame rate | 120 frames per second |
| Minimum video length | 0.25 seconds |
| File names | File names may contain letters, numbers, spaces, and symbols, but must not begin with a period . |

## Recommended video specifications

| Feature | Recommendation |
|---------|----------------|
| Aspect ratio | The aspect ratio should be one of the following:<br>16:9<br>9:16<br>4:3<br>3:4<br>1:1 |
| Bitrates | Shopify's video pipeline will process incoming videos and auto select the best quality by analyzing the input media and selecting an appropriate bitrate from the ranges below.<br><br>**HLS**<br>SD 480: Range from 900 kbps to 2800 kbps<br>HD 720: Range from 2000 kbps to 6500 kbps<br>HD 1080: Range from 3200 kbps to 10400 kbps<br><br>**MP4**<br>SD 480: Range from 900 kbps to 2800 kbps<br>HD 720: Range from 2000 kbps to 6500 kbps<br>HD 1080: Range from 3200 kbps to 10400 kbps<br><br>**MP4**<br>SD 480: Range from 0.9 Mbps to 1.5 Mbps<br>HD 720: Range from 1.6 Mbps to 4.5 Mbps<br>HD 1080: Range from 2.5 Mbps to 7.2 Mbps |
| Frame rate | 60 fps<br>30 fps<br>25 fps |
| Resolution | 3840x2160 (UHD)<br>1920x1080 (1080p)<br>1280x720 (720p)<br>854x480 (480p)<br><br>Vertical orientation for the above resolutions are also recommended, e.g., 720x1280 px |
| Supported codecs | Video: H.264 (AVC)<br>Audio: AAC, MP3, Opus |
| Supported color spaces | Rec.601<br>Rec.709<br>Rec.2020 |

## Generic file requirements

Generic files can be any file other than HTML, and are intended for downloading by the customer.

| Attribute | Requirement |
|-----------|-------------|
| File size | Maximum of 20 MB |
| File formats | Any file type except HTML |
| File names | File names may contain letters, numbers, spaces, and symbols, but must not begin with a period . |

## File format requirements

If a shop is on a paid plan, then you can upload most file formats other than HTML.

If a shop is on a trial plan, then you can upload only the following file formats:

- JavaScript (JS)
- CSS
- GIF
- JPEG
- PNG
- JSON
- CSV
- PDF
- WebP
- HEIC

## Next steps

- Manage media objects on product variants with the GraphQL Admin API.
- Use Liquid to add product media to a store's theme.
