import { Link, NavLink, useMatches } from '@remix-run/react'


export default function sqdsqdsq() {
	const matches = useMatches()
	const isOnSearchPage = matches.find(m => m.id === 'routes/users+/index')
	return (
		<header className="bg-header py-4 px-4 text-headertext border-yellow-400 p-4 header-bb">
			<div className="max-w-4xl mx-auto flex flex-col">
				<div className="flex justify-between items-center ">
					<div className="flex items-center">
						<h1 className="font-semibold font-sans text-lg mr-4">
							<Link to="/">Gaming</Link>
						</h1>
						<NavLink
							to=""
							className="px-4 font-semibold font-sans text-sm"
						>
							Home
						</NavLink>
						{/* <NavLink
							to="test"
							className="font-semibold font-sans text-sm"
						>
							test
						</NavLink> */}
					</div>
					<div className="flex justify-center items-center">
						{isOnSearchPage ? null : (
							<div className="mr-4 max-w-sm flex-1">
								Search
							</div>
						)}
						{/* <Link className="text-lg mx-2" to="/signup">
							Login
						</Link>
						<Link className="text-lg mx-2" to="/signup">
							Sign up
						</Link> */}
					</div>
				</div>
			</div>
		</header>
	)
}
