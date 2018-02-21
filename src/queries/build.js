'use strict';

exports.UPDATE_BUILD = `
  UPDATE builds
  SET status = $/status/
  WHERE build_id = $/status/;
`;
