// Date objects stringified in JSON end up as ISO strings like
// `2025-10-02T16:25:09.659Z`
const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

// JSON deluxe? JSON+NDX portmenteau? A random smattering or letters that
// coincidentally kind of make sense in this context? Who can say?
const JSONDX = {
  stringify: (val: unknown) => JSON.stringify(val),
  parse: <T>(json: string | null) => {
    if (json === null) return null;
    return JSON.parse(json, (_, val) => {
      if (!dateRegex.test(val)) return val;
      const date = new Date(val);
      // The result of passing an invalid date into the Date constructor is still
      // a Date object. A valid date will coerce to a number, while an invalid
      // date will coerce to NaN
      if (isNaN(date.getTime())) return val;
      return date;
    }) as T;
  },
};

export default JSONDX;
