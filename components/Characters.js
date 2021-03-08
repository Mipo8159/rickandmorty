import React from 'react';
import Image from 'next/image';
import { Heading, Text, SimpleGrid } from '@chakra-ui/react';

const Characters = ({ characters }) => {
	return (
		<SimpleGrid columns={[1, 2, 3]} spacing='40px'>
			{characters.map((character) => (
				<div key={character.id}>
					<Image src={character.image} width={300} height={300} />
					<Heading as='h4' size='md' align='center'>
						{character.name}
					</Heading>
					<Text align='center'>Origin:{character.origin.name}</Text>
					<Text align='center'>Location:{character.origin.Location}</Text>
				</div>
			))}
		</SimpleGrid>
	);
};

export default Characters;
