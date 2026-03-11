import React from 'react'

const ProfileId = async ({params}:{params: Promise<{id:string}>}) => {
    const {id} = await params
  return (
    <div>Profile {id}</div>
  )
}

export default ProfileId