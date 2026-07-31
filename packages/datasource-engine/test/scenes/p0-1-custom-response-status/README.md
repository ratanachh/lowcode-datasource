# About this scene

This is a common scene — the fetched payload wraps another data layer, and error statuses may need handling.

For example, a successful response looks like:

```json
{
  "success": true,
  "data": {
    // ...
  }
}
```

In an error scene, the server returns:

```json
{
  "success": false,
  "message": "error reason",
  "code": "error code"
}
```

-- In that case, exception monitoring / analytics should be triggered.
