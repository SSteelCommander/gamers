import React from "react";

function Rating({ value }) {
  return (
    <div>
      {[...Array(value)].map((_, i) => (
        <span key={i} className="star">
          &#9733;
        </span>
      ))}
      {[...Array(5 - value)].map((_, i) => (
        <span key={i + value} className="star">
          &#9734;
        </span>
      ))}
    </div>
  );
}

export default Rating;
