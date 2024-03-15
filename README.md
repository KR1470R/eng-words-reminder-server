<center>
<h1>
	eng-words-reminder 
<div>
	<img alt="" src="https://badgen.net/badge/nest/^9.0.0/green">
	<img alt="" src="https://badgen.net/badge/node/^20/green">
	<img alt="" src="https://badgen.net/badge/redis/^7.0.0/red">
	<img alt="" src="https://badgen.net/badge/typescript/^4.7.0/blue">
</div>
</h1>
A node.js server which used for reminding and teaching english words to WearOS.
</center>

# API Overview
The API is described with Swagger, so you can easily check the docs by this [link](https://kr1470r.xyz/eng-words-reminder/demo/docs).
# Setting up
```bash
git clone git@github.com:KR1470R/eng-words-reminder-server.git && \
cd eng-words-reminder-server/ && \
npm ci
```
## Configuration
First of all, let's make a copy of the `configs/.env.example`:
```bash
cp configs/.env.example configs/.env
```
## Config overview
<table>
  <tr>
    <th>Variable</th>
    <th>Explanation</th>
  </tr>
  <tr>
    <td>SERVER_PORT</td>
    <td>Port for the local server.</td>
  </tr>
  <tr>
    <td>SERVER_ENV</td>
    <td>
    <strong>demo</strong> - makes <code>/docs</code> endpoint available only; <br>
     <strong>dev</strong> - all endpoints available for development; <br> 
     <strong>prod</strong> - makes <code>/docs</code> disabled.
    </td>
  </tr>
  <tr>
    <td>REDIS_CACHE_HOST</td>
    <td>Redis host(i.e <code>localhost</code>).</td>
  </tr>
  <tr>
    <td>REDIS_CACHE_PORT</td>
    <td>Redis port(i.e <code>6379</code>).</td>
  </tr>
  <tr>
    <td>REDIS_CACHE_DB</td>
    <td>Which DB to use(by default <code>0</code>).</td>
  </tr>
  <tr>
    <td>REDIS_CACHE_USERNAME</td>
    <td>Redis username.</td>
  </tr>
  <tr>
    <td>REDIS_CACHE_PASSWORD</td>
    <td>Redis user password.</td>
  </tr>
  <tr>
    <td>JWT_SECRET</td>
    <td>Your secret for JWT Auth.</td>
  </tr>
  <tr>
    <td>MAX_TERMS_PER_REQUEST</td>
    <td>That's the limit for amount vocabulary words should be returned when requesting on <code>dataset-user/book-words</code>(recommended <code>10</code>).</td>
  </tr>
    <tr>
    <td>DATA_PATH</td>
    <td>The absolute path to the dataset of the vocabulary(note, that for now the dataset should be in a specific JSON format, exported from the Telegram as messages). Example of such message:<br>
<pre>
    /vocab
    word - meaning;
    word2 - meaning;
    and so on...<pre>
   </td>
  </tr>
  <tr>
    <td>GLOBAL_PREFIX</td>
    <td>This can be skipped and unset.</td>
  </tr>
</table>

</body>
</html>

# Run
After the project initialized, installed dependencies and configured, you are able to run the server:
```bash
ENV_PATH="<absolute-path-to-the-project>/configs/.env" npm run start
```

