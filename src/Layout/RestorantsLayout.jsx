// Pages/RestaurantLayout.jsx
import { Outlet } from 'react-router-dom'
import { RestaurantNavbar } from '../Components/Restaurant/RestaurantNavbar'

export default function RestaurantLayout() {
  return (
    <div className="relative">
      <RestaurantNavbar />
        <Outlet />
    </div>
  )
}
