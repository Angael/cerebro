import React from "react";

type Props = {};

const NotFound = () => {
  return (
    <article className="flex-1 flex col gap-1 center">
      <div>
        <h1 className="h1">404</h1>
        <p className="body1">Page not found</p>
      </div>
      <p className="body2">Please check the URL</p>
    </article>
  );
};

export default NotFound;
