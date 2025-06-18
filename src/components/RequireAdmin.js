import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

export default function RequireAdmin({ role }) {
  return role === 'admin'
  ? <Outlet />
  : <Navigate to='/orders' replace  />
}
