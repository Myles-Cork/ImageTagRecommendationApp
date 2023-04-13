import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Checkbox(props) {
	return (
		<div className='space-x-5 flex flex-row'>
			<input id={props.tag + "box"} value={props.tag} type='checkbox' className={props.className} />
			<label className='font-poppins text-lg' htmlFor={props.tag}>
				{props.tag}
			</label>
		</div>
	);
}
export default function TagSelection() {
	const location = useLocation();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		// Get tags
		let tagChecks = document.querySelectorAll('.tagCheckbox:checked');
		let tags = [];
		if(tagChecks.length !== 0){
			tagChecks.forEach(tagCheck => {
				tags.push(tagCheck.value);
			});
		}

		console.log(tags);

		// Call api and give image url+tags
		let jsonData = {
			"url": location.state,
			"tags": tags
		};

		fetch("http://localhost:5000/addimage",{
			method: 'POST',
			mode:"cors",
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify(jsonData)
		}).catch(error => console.log('error', error));

		navigate('/');
	};

	return (
		<div>
			<h1 className='relative flex p-10 justify-center font-bold font-poppins text-5xl'>
				Confirm Tags
			</h1>

			<div id='image' className='flex flex-col justify-center w-full'>
				<img
					src={location.state}
					alt='Uploaded'
					className='object-contain h-[300px]'
				/>
				<form onSubmit={handleSubmit} className='py-5 space-y-5'>
					<div className='flex justify-center'>
						<div className='flex flex-col items-start space-y-5'>
							<Checkbox className="tagCheckbox" tag='panda' />
							<Checkbox className="tagCheckbox" tag='animal' />
							<Checkbox className="tagCheckbox" tag='bear' />
							<Checkbox className="tagCheckbox" tag='toy' />
							<Checkbox className="tagCheckbox" tag='dog' />
						</div>
					</div>

					<div className='flex justify-center'>
						<button type='submit' className='bg-black p-1 py-2 w-20 rounded-md font-semibold text-white'>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
