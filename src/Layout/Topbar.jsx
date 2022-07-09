import { USER_IMAGE } from "../config";

const Topbar = () => {
	return (
		<div className="relative w-full">
			<div className="bg-white flex flex-col items-center justify-between p-3 shadow-lg w-full sm:flex-row sm:px-5 md:px-7">
				<div className="my-1 px-2 text-center w-full sm:text-left">
					<p className="capitalize font-bold my-1 text-gray-800 text-sm tracking-wide md:text-base">
						welcome, jarel johnson
					</p>
					<span className="my-1 text-gray-400 text-sm">
						You're doing great this week, keep it up
					</span>
				</div>
				<div className="flex items-center my-1 px-3 w-full sm:justify-end">
					<div className="flex items-center px-2">
						<div className="h-[30px] rounded-full w-[30px]">
							<img
								alt="user"
								className="h-full rounded-full w-full"
								src={USER_IMAGE}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Topbar;
