# Nukleio for Python

A typed, dependency-free Python client for reading Nukleio portfolio data.

```bash
pip install nukleio
```

```python
import os
from nukleio import NukleioClient, UserData

client = NukleioClient(os.environ["NUKLEIO_API_KEY"])
user: UserData = client.get_user_data()
print(user["name"])
```

HTTP errors raise `NukleioApiError` with `status_code` and `response_body`. Pass `api_url` to use a local or alternative endpoint.
