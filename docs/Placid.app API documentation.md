# Placid.app API documentation

Placid.app is a creative automation toolkit designed to help users generate shareable, on-brand visuals at scale[1][2]. This powerful platform offers a range of features and capabilities:

## Key Features

1. **Dynamic Design Templates**: Users can create custom designs with intelligent placeholders using a drag-and-drop editor.

2. **Multi-format Generation**: Placid allows for the creation of images, PDFs, and videos from custom templates.

3. **API and Integration Options**: The platform provides both REST and URL APIs for image generation, as well as REST APIs for PDF and video generation[6]. It also offers integrations with popular tools like Airtable, ChatGPT, Ghost, Zapier, and WordPress.

4. **Automation Capabilities**: Users can set up workflows to automatically generate visuals for social media, marketing assets, and other purposes.

5. **Studio Feature**: This allows teams to generate on-brand marketing visuals using shareable forms, making it easy for non-designers to create consistent content.

## Use Cases

Placid.app caters to various needs, including:

- **Social Media Content**: Automating the creation of visuals for platforms like Instagram, Twitter, Facebook, and Pinterest.
- **Marketing Materials**: Generating promotional graphics, email campaign images, and other marketing assets.
- **Open Graph and Social Share Images**: Automatically creating visuals for better representation when content is shared on social platforms.

## Target Audience

Placid.app is designed for creators, marketers, and businesses looking to streamline their visual content creation process. It's particularly useful for teams that need to produce a large volume of on-brand visuals efficiently.

By offering a combination of customization, automation, and integration capabilities, Placid.app aims to simplify and scale the process of creating visual content for various digital marketing needs.

# Authentication

* * *

- [Placid API token](/docs/2.0/rest/authentication#get-api-token)
- [Usage](/docs/2.0/rest/authentication#usage)

The Placid REST API uses authentication via an API token. It is passed along with every API call to identify your account and access the templates from your project.

## Placid API token

Placid API tokens are project-specific. For every API project you create, you'll get a unique token.

- Log in on [placid.app/login](https://placid.app/login)
- Go to the `Projects` overview
- Choose the project you want to generate images for
- Click `API Tokens` in the left menu

[Go to project overview](https://placid.app/app/projects)

## Usage

All of your Placid requests must contain a header with your API token.

``` code
Authorization: Bearer {TOKEN}
```

# Rate Limiting

* * *

- [Rate Limit](/docs/2.0/rest/rate-limit#rate-limit)

Our API employs rate limiting to ensure fair usage and protect our service from abuse. This document provides information on the rate limits we impose and how you can monitor your current usage.

## General Limits for Plans

- `60` requests per minute

## Endpoints with Special Limits

Some specific endpoints may have unique rate limits to ensure the stability of the service. For example:

- Create Image with `create_now` option set to `true`: `10` simultaneous requests

## Headers

The following headers in the API response provide information about your current rate limit status:

- `X-RateLimit-Limit`: The maximum number of requests allowed in the current time frame.
- `X-RateLimit-Remaining`: The number of requests left for the current time frame.
- `X-RateLimit-Reset`: The time (in UTC epoch seconds) when the rate limit will reset.

## Handling Rate Limits

If you exceed the rate limits, the API will return a `429 Too Many Requests` status code.

## Best Practices

- **Handle `429` Responses Gracefully**: Implement error handling to detect rate limit errors and adjust your request rate accordingly. Consider implementing a retry mechanism with an exponential backoff strategy.
- **Monitor Headers**: Always monitor the `X-RateLimit-*` headers to be aware of your current usage and adapt accordingly.

## Increase Rate Limits

We're open to customize these limits for you if you have a specific use case in mind. Please inquire
via [armin@placid.app](mailto:armin@placid.app)

# Error Codes

* * *

- [Error Codes](/docs/2.0/rest/errors#)

If your query fails, the API will return a 3-digit error code.

| Code | Type |
| --- | --- |
| **400** | Bad Request |
| **401** | Unauthorized |
| **404** | Template Not found |
| **422** | Validation error |
| **429** | Too Many Requests - Rate Limit reached |
| **500** | Server Error - If the error persists, please contact [armin@placid.app](mailto:armin@placid.app) |

# Upload Media

* * *

The Upload Media endpoint allows you to temporarily upload files to
our storage and use them within your creative automation workflow.

After sending the files to the endpoint you will receive Placid URLs that you can fill into your `picture` layers.

### Endpoint

| Method | URI |
| --- | --- |
| POST | `https://api.placid.app/api/rest/media` |

## Request

```  sql
POST /api/rest/media HTTP/1.1
Host: api.placid.app
Authorization: Bearer YOUR_API_TOKEN
Content-Type: multipart/form-data

Content-Disposition: form-data; name="file"; filename="example.jpg"
Content-Type: image/jpeg

[Binary data for the file]

Content-Disposition: form-data; name="file2"; filename="example.jpg"
Content-Type: image/png

[Binary data for the file]
```

Copy

> **Note:** The files must be sent as Content-Type: multipart/form-data

| Field | Values |
| --- | --- |
| `file` | Multiple files can be uploaded by using different custom names. Up to 5 files can be uploaded at once. |

## Response

File URLs will be returned in a key/value fashion with the names you provided

```  json
{
    "media": [\
        {\
            "file_key": "file",\
            "file_id": "https:\/\/storage.placid.app\/2020-01-01\/file.jpg"\
        },\
        {\
            "file_key": "file2",\
            "file_id": "https:\/\/storage.placid.app\/2020-01-01\/file.png"\
        }\
    ]
}
```

# Images

* * *

- [Example Call](/docs/2.0/rest/images#example-call)

To generate an image with the Placid REST API:

1. **Create an API project** or add the **API integration** to your project in Placid
2. Create and **design your template**
3. Send your **[data and customizations to the API](/docs/2.0/rest/generate-images)**
4. **[Poll the GET endpoint for status updates](/docs/2.0/rest/images#show)** or use a webhook to get the generated image

> **1 image = 1 credit**
>
> Switch to test mode for free watermarked previews!

## Example Call

![](/images/docs-image-generation-example.jpg)

```  json
// - POST to endpoint `https://api.placid.app/api/rest/images`)

{
    ...

    "template_uuid": "ospo24ysn",
    "layers": {
        "img": {
            "image": "https://faywoodwildlife.com/images/lion-singh.jpg"
        },
        "subline": {
            "text": "Employee of the month"
        },
        "title": {
            "text": "Meet Singh"
        }
    },

    ...

    // Options for filename, size modifications, export,..
}

```

Copy

* * *

## The image object

### Properties

```  json
{
    "id": 1,
    "status": "queued",
    "image_url": null,
    "polling_url": null
}
```

Copy

| Field | Values |
| --- | --- |
| `id` | Unique image `id` for internal reference |
| `status` | `queued` The request has been put into the queue. <br>`finished` The image has been created successfully. <br>`error` There was an error. |
| `image_url` | URL to created image or `null` |
| `polling_url` | Endpoint that you can GET poll for status updates |

* * *

## Create an image

Create a new image by using the following endpoint and request structure:

### Endpoint

| Method | URI |
| --- | --- |
| POST | `https://api.placid.app/api/rest/images` |

```  json
{
  "template_uuid": "{template_uuid}",

  "webhook_success": "https://webhook.url",
  "create_now": false,
  "passthrough": null,
  "errors": [],
  "layers": {
      "img": {
          "image": "https://imageurl.jpg"
      },
      "subtitle": {
          "hide": true
      },
      "title": {
          "text": "Lorem Ipsum"
      }
      ...
  },
  "modifications": {
     "width": "<width>",
     "height": "<height>",
     "filename": "<filename>"
  },
  "transfer": {
     "to": "s3",
     "key": "<your key>",
     "secret": "<your secret>",
     "region": "<region name>",
     "bucket": "<bucket name>",
     "visibility": "public",
     "path": "images/image.jpg",
     "endpoint": "https://exampleendpoint.com"
  }
}

```

Copy

| Field | Values | Description |
| --- | --- | --- |
| `template_uuid` | Template UUID | Template UUID to be used for image creation |
| `webhook_success` | Webhook URL | After the image is created Placid will `POST` the response to this Webhook URL |
| `create_now` | `true` or `false` | Process the image instantly instead of queueing it. This might fail if your worker is too busy or if you start too many simultaneous requests (check the [rate limit](/docs/2.0/rest/rate-limit)) |
| `passthrough` | `string` or `array` | Any data added to this parameter will be saved and sent in any subsequent webhooks and requests for this image (max-length is 1024 characters) |
| `layers` | [View Layer Properties](layers) | Dynamically change the content and properties of your image layers |
| `transfer` |  | Additionally transfer the generated image to your storage |

### Image content

The content of your image will be defined by the data in the `layers` object. See [layer properties](/docs/2.0/rest/layers) for possible modifications.

### Export / transfer

To transfer the generated image to your storage use the `transfer` object.

| Field | Values |
| --- | --- |
| `transfer.to` | `s3` |
| `transfer.key`, `transfer.secret` | Your credentials (Placid never stores them) |
| `transfer.bucket` | Your bucket name |
| `transfer.visibility` | `public` or `private` |
| `transfer.path` | File path (Define the full image path starting from the root directory of your bucket, including filename and file extension. Placid will overwrite existing files in the specified directory!) |

### File modifications

To modify the generated image use the `modifications` object.

| Field | Values |
| --- | --- |
| `modifications.width` | Image `width`<br> Aspect ratio of template will always be kept to fit into your modifications |
| `modifications.height` | Image `height`<br> Aspect ratio of template will always be kept to fit into your modifications |
| `modifications.filename` | Filename for the generated image |
| `modifications.image_format` | Specify the output image format. Allowed values: `auto` (default; Dynamically selects `jpg` or `png` based on canvas transparency), `jpg`, `png`, `webp` |
| `modifications.dpi` | Define the output DPI of the PDF. Allowed values are `72`(default), `150`, `300` |
| `modifications.color_mode` | Set to `rgb` (default) or `cmyk` |

* * *

## Retrieve an image

This endpoint allows you to retrieve an image by providing their unique `id`. Refer to [the object](#object) at the top of this page to see which properties are included with image objects.

### Endpoint

| Method | URI |
| --- | --- |
| GET | `https://api.placid.app/api/rest/images/{id}` |

* * *

## Delete an image

This endpoint allows you to delete an image by providing its unique `id`. Once deleted, the image cannot be retrieved or used.

### Endpoint

| Method | URI |
| --- | --- |
| DELETE | `https://api.placid.app/api/rest/images/{id}` |

### Response

- **Success**: On successful deletion, the API will return a `204 No Content` status code.
- **Not Found**: If the image with the specified `id` does not exist, the API will return a `404 Not Found` error.

# PDF Generation

* * *

- [Example Call](https://placid.app/docs/2.0/rest/pdfs#example-call)

To generate a PDF with the Placid REST API:

1. **Create an API project** or add the **API integration** to your project in Placid
2. Create and **design your template(s)**
3. Send your **[data and customizations to the API](https://placid.app/docs/2.0/rest/pdfs#create)**
4. **[Poll the GET endpoint for status updates](https://placid.app/docs/2.0/rest/pdfs#show)** or use a webhook to get the generated PDF file

> **1 PDF page = 2 credits**
>
> Switch to test mode for free watermarked previews!

## Example Call

```  json
// - POST to endpoint `https://api.placid.app/api/rest/pdfs`

{
    ...

    "pages": [\
        {\
            "template_uuid": "jxac36kja",\
            "layers": {\
                "name": {\
                    "text": "Jonathan Doe"\
                },\
                "course": {\
                    "text": "has completed the online course « Authentic Business Branding » taught by Frida Baumann on January 24, 2023."\
                },\
                "signature-instructor": {\
                    "image": "https://growthacademy.com/assets/instructors/sig/baumann.png"\
                },\
                "labelsignature-instructor": {\
                    "text": "Frida Baumann, instructor"\
                }\
            },\
        },\
    ],

    ...

    // Options for filename, size modifications, export,..
}

```

Copy

* * *

## The PDF object

### Properties

```  json
{
    "id": 1,
    "status": "queued",
    "pdf_url": null,
    "polling_url": null
}
```

Copy

| Field | Values |
| --- | --- |
| `id` | Unique pdf `id` for internal reference |
| `status` | `queued` The request has been put into the queue. <br>`finished` The pdf has been created successfully. <br>`error` There was an error. |
| `pdf_url` | URL to created pdf or `null` |
| `polling_url` | Endpoint that you can GET poll for status updates |

* * *

## Create a PDF

Create a new pdf by using the following endpoint and request structure.
PDFs are generated from one or more templates used as `pages`, filling their `layers` with your data.

### Endpoint

| Method | URI |
| --- | --- |
| POST | `https://api.placid.app/api/rest/pdfs` |

```  json
{
  "webhook_success": "https://webhook.url",
  "passthrough": null,

  "pages": [\
    {\
        "template_uuid": "<template_uuid>",\
        "layers": {\
            "title": {\
                "text": "Lorem Ipsum"\
            },\
            "logo": {\
                "image": "https://imageurl.png"\
            },\
            "qr-code": {\
                "value": "https://qr-code.url"\
            }\
            ...\
        },\
    },\
    // ...\
  ],

  "modifications": {
  },
  "transfer": {
  }
}

```

Copy

| Field | Values | Description |
| --- | --- | --- |
| `webhook_success` | Webhook URL | After the PDF is created Placid will `POST` the response to this Webhook URL |
| `passthrough` | `string` or `array` | Any data added to this parameter will be saved and sent in any subsequent webhooks and requests for this PDF (max-length is 1024 characters) |
| `pages` | `array` of page objects | Your desired pages/templates; Add multiple templates to get a merged PDF |
| `transfer` |  | Additionally transfer the generated PDF to your storage |

### PDF content

The content of your PDF will be defined by an array of templates in your `pages` object.

| Field | Values | Description |
| --- | --- | --- |
| `pages.*.template_uuid` | The ID of the template used for your page |  |
| `pages.*.layers` | [View Layer Properties](https://placid.app/docs/2.0/rest/layers) | Dynamically change the content and properties of your template layers |

Get your `{template_uuid}` from the template overview in the `Templates` tab of your Placid API project.

![https://placid.app/images/placid-template-id.jpg](https://placid.app/images/placid-template-id.jpg)

- The API allows you to create a pdf from one or more pages / templates, merged in the order you define

### Export / transfer

To transfer the generated video to your storage use the `transfer` object.

| Field | Values |
| --- | --- |
| `transfer.to` | `s3` |
| `transfer.key`, `transfer.secret` | Your credentials (Placid never stores them) |
| `transfer.bucket` | Your bucket name |
| `transfer.visibility` | `public` or `private` |
| `transfer.path` | File path (Define the full pdf path starting from the root directory of your bucket, including filename and file extension. Placid will overwrite existing files in the specified directory!) |

### File modifications

To modify the generated pdf use the `modifications` object. These modifications override the template defaults.

| Field | Values |
| --- | --- |
| `modifications.filename` | Filename of the generated PDF |
| `modifications.image_quality` | Set image quality level `high` (default), `medium`, `low` |
| `modifications.dpi` | Define the output DPI of the PDF. Allowed values are `96`(default), `150`, `300` |
| `modifications.color_mode` | Set to `rgb` (default) or `cmyk` |
| `modifications.color_profile` | **Beta feature:** We additionally offer the selection of color profiles as a beta feature. If you're interested in testing it, [please contact us 💬](mailto:armin@placid.app)<br> Set one of the following color profiles<br>`none` (default) <br>RGB:<br>`rgb-profile-1` \- sRGB IEC61966-2.1 <br>`rgb-profile-2` \- Adobe RGB (1998) <br>`rgb-profile-3` \- ProPhoto RGB <br> CMYK:<br>`cmyk-profile-1` \- ISO Coated v2 (ECI) <br>`cmyk-profile-2` \- ISO Coated v2 300% (ECI v2) <br>`cmyk-profile-3` \- Coated FOGRA39 300% <br>`cmyk-profile-4` \- U.S. Web Coated (SWOP 2006) 3v2 <br>`cmyk-profile-5` \- Japan Color 2cmyk-profile-3011 Coated |

* * *

## Retrieve a PDF

This endpoint allows you to retrieve a PDF by providing their unique `id`. Refer to [the object](https://placid.app/docs/2.0/rest/pdfs#object) at the top of this page to see which properties are included with PDF objects.

### Endpoint

| Method | URI |
| --- | --- |
| GET | `https://api.placid.app/api/rest/pdfs/{id}` |

* * *

## Delete a PDF

This endpoint allows you to delete a PDF by providing its unique `id`. Once deleted, the PDF cannot be retrieved or used.

### Endpoint

| Method | URI |
| --- | --- |
| DELETE | `https://api.placid.app/api/rest/pdfs/{id}` |

### Response

- **Success**: On successful deletion, the API will return a `204 No Content` status code.
- **Not Found**: If the PDF with the specified `id` does not exist, the API will return a `404 Not Found` error.

# Video Generation

* * *

- [Example Call](/docs/2.0/rest/videos#example-call)

To generate a video with the Placid REST API:

1. **Create an API project** or add the **API integration** to your project in Placid
2. Create and **design your template(s)**
3. Send your **[data and customizations to the API](/docs/2.0/rest/videos#create)**
4. **[Poll the GET endpoint for status updates](/docs/2.0/rest/videos#show)** or use a webhook to get the generated video

> **Every 10 seconds = 10 credits**
>
> Switch to test mode for free watermarked previews!

## Example Call

Your browser does not support the video tag.

```  json
// - POST to endpoint `https://api.placid.app/api/rest/videos`

{
    ...

    "clips": [\
        {\
            "template_uuid": "illcmemnt",\
            "layers": {\
                "video": {\
                    "video": "https://socialmediacollection.com/assets/video-tiktok-1.mp4"\
                },\
                "logo": {\
                    "image": "https://socialmediacollection.com/assets/logo.png"\
                },\
                "username": {\
                    "text": "@username"\
                }\
            },\
        },\
    ],

    ...

    // Options for filename, size modifications, export,..
}

```

Copy

* * *

## The video object

### Properties

```  json
{
    "id": 1,
    "status": "queued",
    "video_url": null,
    "polling_url": null
}
```

Copy

| Field | Values |
| --- | --- |
| `id` | Unique video `id` for internal reference |
| `status` | `queued` The request has been put into the queue. <br>`finished` The video has been created successfully. <br>`error` There was an error. |
| `image_url` | URL to created video or `null` |
| `polling_url` | Endpoint that you can GET poll for status updates |

* * *

## Create a Video

Create a new video by using the following endpoint and request structure.
Videos are generated from one or more templates used as `clips`, filling their `layers` with your data.

### Endpoint

| Method | URI |
| --- | --- |
| POST | `https://api.placid.app/api/rest/videos` |

```  json
{
  "webhook_success": "https://webhook.url",
  "passthrough": null,

  "clips": [\
    {\
        "template_uuid": "<template_uuid>",\
\
        // - audio settings\
        "audio" : "https://mp3url.mp3",\
        "audio_duration" : "...",\
        "audio_trim_start" : "00:00:00",\
        "audio_trim_end" : "00:00:00",\
\
        // - layer settings\
        "layers": {\
            "video": {\
                "video": "https://videourl.mp4"\
            },\
            "img": {\
                "image": "https://imageurl.jpg"\
            },\
            "subtitle": {\
                "hide": true\
            },\
            "title": {\
                "text": "Lorem Ipsum"\
            }\
            ...\
        },\
    },\
    // ...\
  ],

  "modifications": {
     "width": "<width>",
     "height": "<height>",
     "fps": "<fps>",
     "filename": "<filename>",
     "canvas_background": "blur"
  },
  "transfer": {
     "to": "s3",
     "key": "<your key>",
     "secret": "<your secret>",
     "region": "<region name>",
     "bucket": "<bucket name>",
     "visibility": "public",
     "path": "videos/video.mp4",
     "endpoint": "https://exampleendpoint.com"
  }
}

```

Copy

| Field | Values | Description |
| --- | --- | --- |
| `webhook_success` | Webhook URL | After the image is created Placid will `POST` the response to this Webhook URL |
| `passthrough` | `string` or `array` | Any data added to this parameter will be saved and sent in any subsequent webhooks and requests for this video (max-length is 1024 characters) |
| `clips` | `array` of clip objects | Your desired clips/templates; Add multiple templates to get a merged video |
| `transfer` |  | Additionally transfer the generated image to your storage |

### Video content

The content of your video will be defined by an array of templates in your `clips` object.

| Field | Values |
| --- | --- |
| `clips.*.template_uuid` | The ID of the template used for your clip |
| `clips.*.audio` | URL of mp3 audio file for this clip |
| `clips.*.audio_duration` | Set to `auto` to trim audio to video length; defaults to full to include the whole audio track |
| `clips.*.audio_trim_start` | Timestamp of the trim start point `00:00:45` or with milliseconds `00:00:45.25` |
| `clips.*.audio_trim_end` | Timestamp of the trim end point `00:00:55` or with milliseconds `00:00:55.25` |
| `clips.*.layers` | [View Layer Properties](/docs/2.0/rest/layers)<br> Dynamically change the content and properties of your template layers |

Get your `{template_uuid}` from the template overview in the `Templates` tab of your Placid API project.

![https://placid.app/images/placid-template-id.jpg](https://placid.app/images/placid-template-id.jpg)

- The API allows you to create a video from one or more clips / templates, merged in the order you define
- You can fill one or more `picture` layers in your template with video files
- You can fill one or more values into `text` layers of your template
- Use animation and transition settings in the template editor
- Total clip length will be dependent on your dynamic content
- If you fill a clip with > 1 video, the shorter videos will loop automatically until the longest is finished
- Audio tracks are taken from your source video(s)
- Current max video length is 3 minutes (= 180 seconds)
- If you do not define any width and height modifications, the video will be sized according to your first clip template's size
- Differently sized clips will be set on a canvas background customizable via modifications below
- ➡️ [Learn more about Placid video settings, clip length and behaviour](https://placid.app/help/how-to-generate-dynamic-videos-with-placid)

### Export / transfer

To transfer the generated video to your storage use the `transfer` object.

| Field | Values |
| --- | --- |
| `transfer.to` | `s3` |
| `transfer.key`, `transfer.secret` | Your credentials (Placid never stores them) |
| `transfer.bucket` | Your bucket name |
| `transfer.visibility` | `public` or `private` |
| `transfer.path` | File path (Define the full video path starting from the root directory of your bucket, including filename and file extension. Placid will overwrite existing files in the specified directory!) |

### File modifications

To modify the generated video use the `modifications` object.

| Field | Values |
| --- | --- |
| `modifications.format` | `mp4` |
| `modifications.width` | Video `width`<br> Empty = auto |
| `modifications.height` | Video `height`<br> Empty = auto |
| `modifications.canvas_background` | Defaults to `#000000`; Enter hexcode or `blur` for blurred |
| `modifications.fps` | Defaults to `25` fps; min `1` max `30` |
| `modifications.filename` | Filename of the generated video |

* * *

## Retrieve a Video

This endpoint allows you to retrieve a video by providing their unique `id`. Refer to [the object](#object) at the top of this page to see which properties are included with video objects.

### Endpoint

| Method | URI |
| --- | --- |
| GET | `https://api.placid.app/api/rest/pdfs/{id}` |

* * *

## Delete a Video

This endpoint allows you to delete a video by providing its unique `id`. Once deleted, the video cannot be retrieved or used.

### Endpoint

| Method | URI |
| --- | --- |
| DELETE | `https://api.placid.app/api/rest/videos/{id}` |

### Response

- **Success**: On successful deletion, the API will return a `204 No Content` status code.
- **Not Found**: If the video with the specified `id` does not exist, the API will return a `404 Not Found` error.

# Templates

* * *

- [List all templates](/docs/2.0/rest/templates#templates_index)
- [Retrieve a template](/docs/2.0/rest/templates#templates_show)
- [Create a template](/docs/2.0/rest/templates#templates_create)
- [Update a template](/docs/2.0/rest/templates#templates_update)
- [Delete a template](/docs/2.0/rest/templates#templates_delete)

Retrieve the template data of your project including IDs, template titles and layer information via the API.

## The template object

### Properties

```  json
{
    "data": [\
        {\
            "uuid": "template_uuid",\
            "title": "Template Title",\
            "thumbnail": "https://urltoplacidthumbnail.com",\
            "tags": [ "tag1", "tag2" ],\
            "layers": [\
                {\
                    "name": "Text Layer",\
                    "type": "text"\
                },\
                {\
                    "name": "Picture Layer",\
                    "type": "picture"\
                },\
                {\
                    "name": "Rectangle Layer",\
                    "type": "rectangle"\
                },\
                {\
                  "name": "Browser Layer",\
                  "type": "browserframe"\
                }\
            ]\
        }\
    ],
    "links": {
        "first": null,
        "last": null,
        "prev": "...", // - link to previous page
        "next": "..." // - link to next page
    },
    "meta": {
        "path": "https://api.placid.app/api/rest/templates",
        "per_page": 20
    }
}
```

Copy

| Field | Values |
| --- | --- |
| `data` | Array of `template` s |
| `template.uuid` | The template uuid |
| `template.title` | The template title |
| `template.thumbnail` | A URL pointing to a thumbnail preview of the template. This value can be null if the preview is currently being regenerated. |
| `template.tags` | Array of assigned template tags |
| `template.layers` | All `dynamic` layers of the template; To be filled with all applicable [layer properties](/docs/2.0/rest/layers) when [generating images](/docs/2.0/rest/generate-images) |
| `links.prev` | Link to prev cursored page |
| `links.next` | Link to next cursored page |

* * *

## List all templates of a project

Get a list of all your project's templates and their layer information. The API returns 20 items per page.
You can optionally filter templates by a specific collection\_id by including it as a query parameter in your request.

### Endpoint

| Method | URI | Description |
| --- | --- | --- |
| GET | `https://api.placid.app/api/rest/templates` | Retrieve all templates |
| GET | `https://api.placid.app/api/rest/templates?collection_id={collection_id}` | Retrieve templates filtered by `collection_id` |

### Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `collection_id` | `string` | (Optional) The ID of the collection by which to filter the templates |

* * *

## Create a template

Create a new template by using the following endpoint and request structure:

### Endpoint

| Method | URI |
| --- | --- |
| POST | `https://api.placid.app/api/rest/templates` |

### Request

```  json
{
  "title": "template title",
  "width": 1920,
  "height": 1080,

  "tags": ["tag1","tag2"],
  "custom_data": null,
  "from_template": "template_uuid",
  "add_to_collections": ["collection_uuid"]
}

```

Copy

| Field | Values | Description |
| --- | --- | --- |
| `title` | Template Title | Title of the new template. |
| `width` | Template Width | Set the canvas width of the new template. |
| `height` | Template Height | Set the canvas height of the new template. |
| `tags` | Tags | Up to 10 tags |
| `custom_data` | Reference ID | You can attach any value to the template which can be used to reference it later; up to 255 chars <br>**TIP:** You can put in a serialized JSON object |
| `from_template` | From Template | Create a new template based on an existing template UUID; this will override `title`, `width`, and `height`. <br> Use this to duplicate templates. |
| `add_to_collections` | Template Collection IDs | Add the new template to one or more specific template collections. |

* * *

## Retrieve a template

This endpoint allows you to retrieve a template by providing their `template_uuid`. Refer to [the object](#object) at the top of this page to see which properties are included with template objects.

### Endpoint

| Method | URI |
| --- | --- |
| GET | `https://api.placid.app/api/rest/templates/{template_uuid}` |

* * *

## Update a template

Update the details of an existing template. This can include modifying the custom\_data or updating the list of tags.

### Endpoint

| Method | URI |
| --- | --- |
| PATCH | `https://api.placid.app/api/rest/templates/{template_uuid}` |

### Request

```  json
{
  "title": "template title",
  "tags": ["tag1","tag2"],
  "custom_data": null
}

```

Copy

| Field | Values | Description |
| --- | --- | --- |
| `title` | Template Title | Updated Title of the template. |

| Field | Values |
| --- | --- |
| `template.uuid` | The template uuid |
| `template.title` | The template title |
| `template.tags` | Array of assigned template tags |
| `template.layers` | All `dynamic` layers of the template; To be filled with all applicable [layer properties](/docs/2.0/rest/layers) when [generating images](/docs/2.0/rest/images#create), [generating PDFs](/docs/2.0/rest/pdfs#create) or [generating videos](/docs/2.0/rest/videos#create) |

* * *

## Delete a template

This endpoint allows the user to delete a specific template, identified by its template\_uuid.

### Endpoint

| Method | URI |
| --- | --- |
| DELETE | `https://api.placid.app/api/rest/templates/{template_uuid}` |

### Response

Request will return a 200 status code on success.

# Template Collections

* * *

- [The collection object](/docs/2.0/rest/collections#object)
- [List all collections](/docs/2.0/rest/collections#index)
- [Create a collection](/docs/2.0/rest/collections#create)
- [Retrieve a collection](/docs/2.0/rest/collections#show)
- [Update a collection](/docs/2.0/rest/collections#update)
- [Delete a collection](/docs/2.0/rest/collections#delete)

A template collection allows you to group together multiple templates. This feature can be used to further organize your templates; for example, having a collection for a user of your SaaS that holds their templates.

## The collection object

The collection object holds reference data that you can save, and which will be passed through with every request you make to us. It also contains a list of template\_ids with the attached templates.

### Properties

```  json
{
    "id": "...",
    "title": "...",
    "custom_data": "...",
    "template_uuids": [ "template_id_1", "template_id_2", "template_id_3" ]
}
```

Copy

| Field | Values | Description |
| --- | --- | --- |
| `id` | Unique collection `id` for internal reference | ID of the collection |
| `title` | `string` | Collection title |
| `custom_data` | `string` or `object` | Any data added to this parameter will be saved and sent in any subsequent webhooks and requests for this image (max length is 1024 characters) |
| `template_uuids` | `array` of template uuids | A list of template IDs; limited to 500 at the moment |

* * *

## List all collections

This endpoint retrieves all the template collections available for a project.

### Endpoint

| Method | URI |
| --- | --- |
| GET | `https://api.placid.app/api/rest/collections` |

* * *

## Create a collection

Create a new template collection by using the following endpoint and request structure:

### Endpoint

| Method | URI |
| --- | --- |
| POST | `https://api.placid.app/api/rest/collections` |

### Request

```  json
{
  "title": "collection_title",
  "custom_data": null,
  "template_uuids": [ "template_uuid1", "template_uuid2" ]
}
```

Copy

| Field | Values | Description |
| --- | --- | --- |
| `title` | `string` (max 255 chars) | The title of the collection. |
| `custom_data` | string or object | Any data added to this field will be saved and forwarded in any subsequent requests for this collection. Max length is 1024 characters. |
| `template_uuids` | `array` (list of template UUIDs; limited to 500) | An array containing the UUIDs of the templates to be included in the collection |

* * *

## Retrieve a collection

This endpoint allows you to retrieve a collection by providing their `collection_id`. Refer to [the object](#object) at the top of this page to see which properties are included with collection objects.

### Endpoint

| Method | URI |
| --- | --- |
| GET | `https://api.placid.app/api/rest/collections/{collection_id}` |

* * *

## Update a collection

Update the details of an existing template collection. This can include modifying the custom\_data or updating the list of template\_ids.

### Endpoint

| Method | URI |
| --- | --- |
| PATCH | `https://api.placid.app/api/rest/collections/{collection_id}` |

### Request

```  json
{
  "title": "collection_title",
  "custom_data": null,
  "template_uuids": [ "template_uuid1", "template_uuid2" ],
  "add_template_uuids": [ "new_template_uuid1" ],
  "remove_template_uuids": [ "template_uuid1" ]
}
```

Copy

| Field | Values | Description |
| --- | --- | --- |
| `title` | `string` (max 255 chars) | The title of the collection. |
| `custom_data` | `string` or `object` | Any data added to this field will be saved and forwarded in any subsequent requests for this collection. Max length is 1024 characters. |
| `template_uuids` | `array` (list of template UUIDs; limited to 500) | If provided, this will replace the entire existing list of associated templates for the collection. |
| `add_template_uuids` | `array` (list of template UUIDs; limited by the total limit of 500) | Templates specified here will be added to the collection. |
| `remove_template_uuids` | `array` (list of template UUIDs) | Templates specified here will be removed from the collection. |

* * *

## Delete a collection

This endpoint allows the user to delete a specific template collection, identified by its collection\_id.

### Endpoint

| Method | URI |
| --- | --- |
| DELETE | `https://api.placid.app/api/rest/collections/{collection_id}` |

# Layers

* * *

- [General Properties](/docs/2.0/rest/layers#general)
- [Text](/docs/2.0/rest/layers#text)
- [Picture](/docs/2.0/rest/layers#picture)
- [Browserframe](/docs/2.0/rest/layers#browserframe)
- [Barcode](/docs/2.0/rest/layers#barcode)
- [Rating](/docs/2.0/rest/layers#rating)
- [Shape](/docs/2.0/rest/layers#shape)
- [Subtitle](/docs/2.0/rest/layers#subtitle)
The available layer types in Placid templates offer different customization options.

Use the `{layer-name}` assigned in the template editor to customize its properties. **If you don't specify a property, Placid will use the default as defined in the template**.

## General Properties

There are some base properties that can be used on every layer type:

```  json
"{layer-name}": {
  "hide":false,
  "opacity": 100,
  "rotation":"...",
  "position_x":"...",
  "position_y":"...",
  "width":"...",
  "height":"...",
  "link_target":"...",
}
```

Copy

| Property | Description |
| --- | --- |
| `hide` | Set `true` to hide this layer in the template; defaults to `false` |
| `opacity` | Adjust the layer opacity level. Possible values range from `0` to `100` |
| `rotation` | Set the layer rotation from `0` to `359` |
| `position_x` | **Relative positioning**:<br>`+10px` add `10px` to x-axis <br>`-10px` remove `10px` from x-axis<br>**Absolute positioning**:<br>`10px` set x-axis position to `10px` |
| `position_y` | **Relative positioning**:<br>`+10px` add `10px` to y-axis <br>`-10px` remove `10px` from y-axis<br>**Absolute positioning**:<br>`10px` set y-axis position to `10px` |
| `width` | **Relative sizing**:<br>`+10px` add `10px` to width <br>`-10px` remove `10px` from width<br>**Absolute sizing**:<br>`10px` set width to `10px`<br>`50%` set width to `50%` of default layer width |
| `height` | **Relative sizing**:<br>`+10px` add `10px` to height <br>`-10px` remove `10px` from height<br>**Absolute sizing**:<br>`10px` set height to `10px`<br>`50%` set height to `50%` of default layer height |
| `link_target` | Add a clickable link to a custom target url when rendering a non-rastered PDF (f.ex. `https://placid.app`) |

* * *

## Text

```  json
"{layer-name}": {
  "text": "This is the text",
  "text_color": "...", // f.ex #FFFFFF
  "font": "..."

  "alt_text_color": "...", // f.ex #FFFFFF
  "alt_font": "..."
}
```

Copy

| Property | Description |
| --- | --- |
| `text` | Text content. Line breaks can be forced using `\n`<br>**Video only:** You can supply an array of text values to create [a layer with multiple values](https://placid.app/help/how-to-generate-dynamic-videos-with-placid#example-3-fill-a-text-or-picture-layer-with-multiple-values) |
| `text_color` | Text-color as hex-code `#FFFFFF` |
| `font` | Set the font-family of the text layer! [See all available font-families here](/help/fonts#list-of-available-fonts) or [how to use your custom fonts](/help/fonts#changing-custom-fonts-via-api-or-integration) |
| `alt_text_color` | Alternate Text-color as hex-code `#FFFFFF` |
| `alt_font` | Set the alternative font-family of the text layer! [See all available font-families here](/help/fonts#list-of-available-fonts) or [how to use your custom fonts](/help/fonts#changing-custom-fonts-via-api-or-integration) |

* * *

## Picture

```  json
"{layer-name}": {
  "image": "https://...",
  "image_viewport": "1280x1024",
  "video": "https://...",
}
```

Copy

| Property | Description |
| --- | --- |
| `image` | Image URL or URL of the website to screenshot <br>**Video only:** You can supply an array of image URLs to create [a layer with multiple values](https://placid.app/help/how-to-generate-dynamic-videos-with-placid#example-3-fill-a-text-or-picture-layer-with-multiple-values) |
| `image_viewport` | Viewport size for screenshots `widthxheight`; defaults to `1280x1024` |
| `video` | Video URL (.mp4) |

* * *

## Shape

```  json
"{layer-name}": {
  "background_color": "...",
  "border_color": "...",
  "border_radius": "...",
  "border_width": "..."
  "svg": "..."
}
```

Copy

| Property | Description |
| --- | --- |
| `background_color` | Background color as hex-code `#FFFFFF` |
| `border_color` | Border color as hex-code `#FFFFFF` |
| `border_radius` | Border radius in px `2px` or `2`. (only available for rectangles) |
| `border_width` | Border width in px `2px` or `2` |
| `svg` | SVG URL |

* * *

## Browserframe

```  json
"{layer-name}": {
  "image": "https://...",
  "image_viewport": "1280x1024",
  "url": "https://placid.app",
}
```

Copy

| Property | Description |
| --- | --- |
| `image` | Image URL or URL of the website to screenshot |
| `image_viewport` | Viewport size of screenshots `widthxheight`; defaults to `1280x1024` |
| `url` | URL to insert into the browserframe's adress bar |

* * *

## Barcode

```  json
"{layer-name}": {
  "value": "...",
  "color": "...",
}
```

Copy

| Property | Description |
| --- | --- |
| `value` | The barcode value |
| `color` | Color as hex-code `#FFFFFF` |

* * *

## Rating

```  json
"{layer-name}": {
  "value": "...",
}
```

Copy

| Property | Description |
| --- | --- |
| `value` | The rating value (0-5 or 0-10 depending on layer settings, including decimals like 3.64) |

* * *

## Subtitle

```  json
"{layer-name}": {
  "srt": "...",
}
```

Copy

| Property | Description |
| --- | --- |
| `srt` | (optional) URL to SRT file <br> if not supplied, video clip will be auto transcribed |
