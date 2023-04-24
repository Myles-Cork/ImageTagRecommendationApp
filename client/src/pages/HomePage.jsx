import { useEffect, useState } from 'react';
import ImageGrid from '../components/ImageGrid';
import ImageUpload from '../components/ImageUpload';
import TagFilter from '../components/TagFilter';

export default function HomePage() {
	const [allTags, setAllTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);

	useEffect(() => {
		fetch('http://localhost:5000/gettags', {
			method: 'GET',
			mode: 'cors',
		})
			.then((response) => response.json())
			.then((data) => {
				let fetchedTags = [];
				data.forEach((tag) => {
					if (!fetchedTags.includes(tag['name'])) {
						fetchedTags.push({ tag: tag['name'], id: data.indexOf(tag) });
					}
				});
				// sort tags alphabetically
				fetchedTags.sort((a, b) => (a.tag > b.tag ? 1 : -1));
				setAllTags(fetchedTags);
			})
			.catch((error) => console.log('error', error));
	}, []);

	return (
		<div>
			<header className='fixed flex flex-row bg-white w-full justify-between p-5 z-20'>
				<TagFilter
					selectedTags={selectedTags}
					setSelectedTags={setSelectedTags}
					allTags={allTags}
				/>
				<ImageUpload />
			</header>
			<ImageGrid selectedTags={selectedTags} />
		</div>
	);
}
