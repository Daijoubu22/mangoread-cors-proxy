import corsProxy from 'cors-anywhere';
import express from 'express';
import axios from 'axios';

const host = process.env.HOST || '0.0.0.0';
const corsPort = process.env.PORT || 8080;
const imagesProxyPort = process.env.PORT || 8081;

const imagesProxy = express();

function getBase64(url) {
	return axios
		.get(url, {
			responseType: 'arraybuffer'
		})
		.then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

imagesProxy.get('/', (req, res) => {
	getBase64(req.query.url).then((data) => {
		const img = Buffer.from(data, 'base64');
		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': img.length
		});
		res.end(img);
	})
});

imagesProxy.listen(imagesProxyPort, host, () => {
	console.log(`Running Images Proxy on ${host}:${imagesProxyPort}`)
});

corsProxy.createServer({
	originWhitelist: [],
	requireHeader: ['origin', 'x-requested-with'],
	removeHeaders: ['cookie', 'cookie2']
}).listen(corsPort, host, function() {
	console.log('Running CORS Anywhere on ' + host + ':' + corsPort);
});
