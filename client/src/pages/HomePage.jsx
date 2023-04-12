import React from 'react';
import ImageGrid from '../components/ImageGrid';
import ImageUpload from '../components/ImageUpload';

export default function HomePage() {
	return (
		<div>
			<ImageUpload />
			<ImageGrid />
		</div>
	);
}
