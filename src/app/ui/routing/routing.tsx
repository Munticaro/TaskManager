import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { TodolistsList } from 'features/todolistLists/ui/todolistLists'
import { Login } from 'features/auth/ui/Login/login'

export const Routing = () => {
  return (
    <Routes>
      <Route path={'/'} element={<TodolistsList />} />
      <Route path={'/login'} element={<Login />} />
    </Routes>
  )
}
