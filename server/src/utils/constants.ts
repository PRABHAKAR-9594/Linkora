// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  GONE: 410,

  INTERNAL_SERVER_ERROR: 500,
};

// Common / Generic Messages
const COMMON_MESSAGES = {
  REQUIRED_FIELDS: "All fields are required.",
  UPDATE_FIELD_REQUIRED: "Please provide at least one field to update.",
  INTERNAL_SERVER_ERROR: "Something went wrong on the server.",
  ACTION_SUCCESSFUL: "Action completed successfully.",
  INVALID_INPUT: "Invalid input provided.",
  SOMETHING_WENT_WRONG: "Something went wrong.",
};

//Authentication & Session Messages
const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Logged in successfully.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  INVALID_PASSWORD: "Incorrect password.",
  UNAUTHORIZED: "Unauthorized access.",

  MISSING_TOKEN: "Token is missing.",
  INVALID_TOKEN: "Token is invalid.",
  INVALID_TOKEN_PAYLOAD: "Invalid token payload.",
  INVALID_REFRESH_TOKEN: "Invalid refresh token.",
  TOKEN_REFRESHED: "Token refreshed successfully.",
  ERROR_DECODING_TOKEN: "Error decoding token.",
  INVALID_OR_EXPIRED_REFRESH_TOKEN: "Refresh token is invalid or expired.",
  INVALID_OR_EXPIRED_TOKEN: "Token is invalid or expired.",

  SESSION_EXPIRED_DEVICE: "This session has been logged out.",
  SESSION_EXPIRED_GLOBAL:
    "Your sessions have been terminated for security reasons.",

  EMAIL_REQUIRED: "Email is required.",
  EMAIL_SENT: "Verification email sent successfully.",
  EMAIL_VERIFIED: "Email verified successfully.",
  EMAIL_ALREADY_VERIFIED: "User email is already verified.",
  UNVERIFIED_EMAIL: "Email is not verified.",
  VERIFICATION_TOKEN_EXPIRED: "Verification token has expired.",

  OTP_SENT: "OTP sent successfully.",
  OTP_RESENT: "OTP re-sent successfully.",
  OTP_VERIFIED: "OTP verified successfully.",
  WRONG_OTP: "Incorrect OTP.",
  OTP_EXPIRED: "OTP expired, please request a new one.",
  OTP_NOT_FOUND: "OTP not found.",

  PASSWORD_UPDATED: "Password updated successfully.",
  SAME_PASSWORD: "New password cannot be the same as the old password.",

  MISSING_META_DATA: "Missing device meta data",
  ALREADY_LOGGED_IN_ANOTHER_DEVICE: "Already logged in on another device.",
};

//Session Messages
const SESSION_MESSAGES = {
  SESSION_ID_MISSING: "Session ID is missing.",
  NOT_FOUND: "Session not found.",
  SESSION_REVOKED: "Session revoked successfully.",
  SESSIONS_FETCHED: "Active sessions retrieved.",
  LOGGED_OUT_OTHER_DEVICES: "Logged out from all other devices.",
  SESSION_ID_NOT_FOUND: "SessionId not found.",
  SESSION_NOT_FOUND_OR_LOGGED_OUT: "Session not found or already logged out.",
  NOT_AUTHORIZED_TO_REVOKE: "Not authorized to revoke this session.",
};

//User Messages
const USER_MESSAGES = {
  REGISTER_SUCCESS: "User registered successfully.",
  UPDATE_SUCCESS: "User updated successfully.",
  UPDATE_FAILED: "User updation failed.",
  DELETE_SUCCESS: "User deleted successfully.",
  DELETE_FAILED: "User deletion failed.",
  FOUND: "User found.",
  NOT_FOUND: "User not found.",
  EMAIL_EXISTS: "Email is already in use.",
  USERNAME_EXISTS: "Username is already in use.",
  NO_DATA_PROVIDED: "No data provided.",
  PROFILE_IMAGE_UPDATE_FAILED: "Failed to update profile image.",
  PROFILE_IMAGE_UPDATE_SUCCESS: "Successfully updated profile image.",
};

//Friend Request Messages
const FRIEND_MESSAGES = {
  REQUEST_SENT: "Friend request sent.",
  REQUEST_ACCEPTED: "Friend request accepted.",
  REQUEST_REJECTED: "Friend request rejected.",
  REQUEST_CANCELED: "Friend request canceled.",
  NOT_FOUND: "Friend request not found.",
  ALREADY_SENT: "Friend request already sent.",
  ALREADY_FRIENDS: "Already friends.",
  NOT_FRIENDS: "Not friends.",
  CANNOT_SELF_REQUEST: "Cannot send request to yourself.",
  CANNOT_SELF_ACCEPT: "Cannot accept your own request.",
  FRIEND_REMOVED: "Friend removed successfully.",
};

//Post Messages
const POST_MESSAGES = {
  CREATED: "Post created successfully.",
  FETCH_SUCCESS: "Posts fetched successfully.",
  NOT_FOUND: "Post not found.",
  LIKE_TOGGLED: (isLiked: boolean) =>
    `Post successfully ${isLiked ? "liked" : "unliked"}.`,
  OWN_POST: "You can't like your own post.",
  UPDATE_UNDER_DEVELOPMENT: "Update post endpoint under development.",
  DELETE_UNDER_DEVELOPMENT: "Delete post endpoint under development.",
  INVALID_CURSOR: "Invalid cursor value.",
};

//Comment / Reply Messages
const COMMENT_MESSAGES = {
  COMMENT_CREATED: "Comment created.",
  SUB_COMMENT_CREATED: "Sub comment created.",
  COMMENT_LIKE_TOGGLED: "Comment like toggled.",
  REPLY_LIKE_TOGGLED: "Reply like toggled.",
  COMMENT_LIST: "Comments of post.",
  NOT_FOUND: "Comment not found.",
  COMMENT_NOT_FOUND_TO_REPLY: "Comment not found to reply.",
  OWN_COMMENT_LIKE: "You can't like your own comment.",
  OWN_REPLY_LIKE: "You can't like your own reply.",
  REPLY_NOT_FOUND: "Reply not found.",
};

//Notification Messages
const NOTIFICATION_MESSAGES = {
  NONE: "No notifications available.",
  FOUND: "Notifications found.",
};

//Story Messages
const STORY_MESSAGES = {
  CREATED: "Story created.",
  NOT_FOUNND : "Story not found.",
  STORY_BY_USER: "Story by user.",
  VIEW_UPDATED: "Story view updated.",
  DELETED: "Story deleted.",
  FRIEND_STORIES_FETCHED: "Friends' stories fetched.",
  OWN_STORY_VIEW_NOT_ALLOWED: "You cannot increase view of your own story.",
};

//Socket Auth Middleware Messages
const SOCKET_AUTH_MESSAGES = {
  NO_COOKIES: "Unauthorized - No cookies.",
  NO_TOKEN: "Unauthorized - No token.",
  INVALID_TOKEN: "Unauthorized - Invalid token.",
};

// Media Upload Messages
const MEDIA_MESSAGES = {
  UPLOAD_SUCCESS: "Media uploaded successfully.",
  SAVED: "Media saved successfully.",
  SIGNATURE_GENERATED: "Upload signature generated successfully.",
  NOT_FOUND: "Media not found.",
};

export {
  HTTP_STATUS,
  COMMON_MESSAGES,
  AUTH_MESSAGES,
  SESSION_MESSAGES,
  USER_MESSAGES,
  FRIEND_MESSAGES,
  POST_MESSAGES,
  COMMENT_MESSAGES,
  NOTIFICATION_MESSAGES,
  STORY_MESSAGES,
  SOCKET_AUTH_MESSAGES,
  MEDIA_MESSAGES,
};
