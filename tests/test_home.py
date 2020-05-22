def test_home_init_react_app(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b'<div id="app"></div>' in response.data
    assert b'<script type="text/javascript" src="/static/app.js"></script>' in response.data
