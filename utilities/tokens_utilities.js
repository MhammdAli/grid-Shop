
import jwt from "jsonwebtoken";
import cookie from "cookie";
import {promisify} from "util";

const verifyToken = promisify(jwt.verify); 

const TokenExpiration = {
  Access : 6 * 60 * 60,
  Refresh : 7 * 24 * 60 * 60,
  RefreshIfLessThan : 4 * 24 * 60 * 60,
}

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: TokenExpiration.Access})
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: TokenExpiration.Refresh})
}

const defaultCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: process.env.NODE_ENV !== "development" ? 'strict' : 'lax',
  path: '/',
}

const refreshTokenCookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Refresh * 1000,
}

const accessTokenCookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Access * 1000,
}

async function verifyRefreshToken(token) { 
  try {
    return await verifyToken(token, process.env.REFRESH_TOKEN_SECRET) 
  } catch (e) {
     return {type : "ERROR",name : e.name}
  }
}

async function verifyAccessToken(token) {
  try {
    return await verifyToken(token, process.env.ACCESS_TOKEN_SECRET) 
  } catch (e) {
     return {type : "ERROR",name : e.name}
  }
}

 
function buildTokens(user) {
    
  const accessPayload = {UID: user.UID , name : user.userName}
  const refreshPayload = {UID: user.UID}

  const accessToken = signAccessToken(accessPayload)
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload)

  return {accessToken, refreshToken}
}


function setTokens(res, access, refresh) {
  const tokens  = [];
  tokens.push(cookie.serialize("ACCESS_TOKEN",access , accessTokenCookieOptions ))
  if(refresh) tokens.push(cookie.serialize("REFRESH_TOKEN", refresh, refreshTokenCookieOptions))
  res.setHeader("Set-Cookie",tokens)
}

function refreshTokens(current) {
 
  const accessPayload = {UID: current.UID}
  let refreshPayload

  const expiration = new Date(current.exp * 1000)
  const now = new Date()
  const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000

  // stop
  if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
    refreshPayload = {UID: current.UID}
  }

  const accessToken = signAccessToken(accessPayload)
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload)

  return {accessToken, refreshToken}
}

function clearTokens(res) { 
  res.setHeader("set-cookie",[
       cookie.serialize("ACCESS_TOKEN", '', {...defaultCookieOptions, maxAge: 0}),
       cookie.serialize("REFRESH_TOKEN", '', {...defaultCookieOptions, maxAge: 0})
  ])
}

module.exports = {
    clearTokens,
    refreshTokens,
    setTokens,
    buildTokens,
    verifyAccessToken,
    verifyRefreshToken
}