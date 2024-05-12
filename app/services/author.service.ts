const getAuthorSignature = () => {
	return { name: process.env.AUTHOR_NAME, lastName: process.env.AUTHOR_LAST_NAME };
};

export { getAuthorSignature };
