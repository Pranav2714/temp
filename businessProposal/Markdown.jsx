import React from "react";
import markdownit from "markdown-it";
import DomPurify from "dompurify";

const md = markdownit({});
const Markdown = (text) => {
  const htmlContent = md.render(text);
  const sanitized = DomPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

export default Markdown;
