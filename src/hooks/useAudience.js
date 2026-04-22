import { useState } from "react";
import { AUDIENCES, DEFAULT_AUDIENCE } from "../constants/audiences";

export function useAudience() {
  const [audienceKey, setAudienceKey] = useState(DEFAULT_AUDIENCE);
  const audience = AUDIENCES[audienceKey];
  return { audienceKey, audience, setAudience: setAudienceKey, AUDIENCES };
}
