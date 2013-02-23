var module = {
  name: "Character Set Not Specified",
  type: "response-processor"
};


var textSubtypeRegex = /^text\/\w+/;
var charsetHeaderRegex = /.+charset\s?=.+/;
var charsetBodyRegex = /<meta.+charset\s?=.+>/gim;

function run(request, response, ctx) {
	var uri = String(request.requestLine.uri);
	var uripart = uri.replace(/\?.*/, "");	
	var alert = false;
	
	// TODO: Implement more checks to filter out static content from results.
	// Only check responses with "Content-Type: text/*"
	if (response.hasHeader("Content-Type")) {
		var hdr = response.getFirstHeader("Content-Type");
		if (textSubtypeRegex.test(hdr.value)) {
			if (response.bodyAsString.length > 0) {
				// Alert if charset not specified in header and body.
				if (!charsetHeaderRegex.test(hdr.value) && !charsetBodyRegex.test(response.bodyAsString)) {
					alert = true;
				}
			}
		}
	}
	if (alert) {
		ctx.alert("vinfo-missing-charset", request, response, {
      output: request.requestLine.uri,
			resource: request.requestLine.uri,
      key: "vinfo-missing-charset" + uripart
		});
	}
}