import { Fragment } from "react";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const IS_URL = /^https?:\/\//;

// Turns plain text containing raw URLs into text + real <a> nodes,
// so opportunity descriptions can carry live links without any markup.
export function linkify(text) {
  return text.split(URL_PATTERN).map((part, i) =>
    IS_URL.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

// Renders a plain-text block (blank line = paragraph break, single
// newline = line break) with URLs auto-linked. Used for descriptions
// pasted in verbatim from source posts.
export function RichText({ text }) {
  const paragraphs = text.trim().split(/\n{2,}/);
  return (
    <div className="rich-text">
      {paragraphs.map((para, pi) => (
        <p key={pi}>
          {para.split("\n").map((line, li, arr) => (
            <Fragment key={li}>
              {linkify(line)}
              {li < arr.length - 1 && <br />}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
