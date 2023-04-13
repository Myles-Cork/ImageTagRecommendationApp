import React from 'react';
import { Gallery } from 'react-grid-gallery';
import '../styles/global.css';

class ImageGrid extends React.Component{
	constructor(props){
		super(props)
		this.state={
			images:[]
		};

		this.handleClick = this.handleClick.bind(this)
	}

	componentDidMount(){
		let jsonData = {
			"tag": "*"
		};

		fetch("http://localhost:5000/queryimages",{
			method: 'POST',
			mode:"cors",
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify(jsonData)
		}).then(response => response.json())
		.then(data => {
			let imgs = [];
			data.forEach(img => {
				let tags = [];
				img["tags"].forEach(tag => {
					tags.push({"value":tag ,"title":tag});
				});
				imgs.push({
					"src":img["url"],
					"tags":tags
				});
			});
			this.setState({images:imgs});
		})
		.catch(error => console.log('error', error));
	}

	handleClick = (_, image) => {
		window.open(image.src, '_blank');
	};

	render(){
		return (
			<div className='h-screen overflow-y-scroll px-1 justify-center'>
				<Gallery
					images={this.state.images}
					enableImageSelection={false}
					rowHeight={400}
					onClick={this.handleClick}
					tagStyle={{
						display: 'inline',
						padding: '.2em .6em .3em',
						fontSize: '75%',
						fontWeight: '500',
						fontFamily: 'Poppins',
						lineHeight: '1',
						color: 'white',
						background: 'rgba(0,0,0,1)',
						textAlign: 'center',
						whiteSpace: 'nowrap',
						verticalAlign: 'baseline',
						borderRadius: '.25em',
					}}
				/>
			</div>
		);
	}
}

export default ImageGrid
