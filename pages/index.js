import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Head from 'next/head';
import { useState } from 'react';
import Characters from '../components/Characters';
import {
	Heading,
	Box,
	Flex,
	Input,
	Stack,
	IconButton,
	useToast,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function Home(results) {
	const initialState = results;
	const [characters, setCharacters] = useState(initialState.characters);

	const [search, setSearch] = useState('');
	const toast = useToast();

	return (
		<Flex direction='column' justify='center' align='center'>
			<Head>
				<title>Pickle rick</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Box mb={4} flexDirection='column' align='center' justify='center' py={8}>
				<Heading as='h1' size='2xl' mb={8}>
					Rick and Morty
				</Heading>

				<form
					onSubmit={async (e) => {
						e.preventDefault();
						const results = await fetch('/api/SearchCharacters', {
							method: 'post',
							body: search,
						});
						const { characters, error } = await results.json();

						if (error) {
							toast({
								position: 'bottom',
								title: 'An error occured',
								description: error,
								status: 'error',
								duration: 5000,
								isClossable: true,
							});
						} else {
							setCharacters(characters);
						}
					}}>
					<Stack maxWidth='350px' width='100%' isInline mb={8}>
						<Input
							placeholder='Search'
							value={search}
							border='none'
							onChange={async (e) => setSearch(e.target.value)}
						/>

						<IconButton
							colorScheme='blue'
							aria-label='Search Database'
							icon={<SearchIcon />}
							disabled={search === ''}
							type='submit'
						/>

						<IconButton
							colorScheme='red'
							aria-label='Reset Button'
							icon={<CloseIcon />}
							disabled={search === ''}
							onClick={async () => {
								setSearch('');
								setCharacters(initialState.characters);
							}}
						/>
					</Stack>
				</form>
				<Characters characters={characters} />
			</Box>
		</Flex>
	);
}

export async function getStaticProps() {
	const client = new ApolloClient({
		uri: 'https://rickandmortyapi.com/graphql',
		cache: new InMemoryCache(),
	});

	const { data } = await client.query({
		query: gql`
			query {
				characters(page: 1) {
					info {
						count
						pages
					}
					results {
						name
						id
						location {
							id
							name
						}
						origin {
							id
							name
						}
						episode {
							id
							episode
							air_date
						}
						image
					}
				}
			}
		`,
	});

	return {
		props: {
			characters: data.characters.results,
		},
	};
}
