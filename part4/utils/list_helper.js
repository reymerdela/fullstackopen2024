const _ = require('lodash');

const dummy = (blog) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (prev, curr) => {
    return prev + curr.likes;
  };
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length < 1) {
    return 0;
  }
  const mostLikes = Math.max(...blogs.map((blog) => blog.likes));
  const { title, author, likes } = blogs.find(
    (blog) => blog.likes === mostLikes
  );
  return {
    title,
    author,
    likes,
  };
};

const mostBlogs = (blogs) => {
  // const authors = {};
  // let maxValue = 0;
  // let maxAuthor;
  // blogs.forEach((blog) => {
  //   authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1;
  // });
  // for (let [a, v] of Object.entries(authors)) {
  //   if (v > maxValue) {
  //     maxValue = v;
  //     maxAuthor = a;
  //   }
  // }
  // return {
  //   author: maxAuthor,
  //   blogs: maxValue,
  // };
  const groupAuthors = _.countBy(blogs, (blog) => blog.author);
  const maxBlogs = Math.max(...Object.values(groupAuthors));
  return {
    author: _.findKey(groupAuthors, (val) => val === maxBlogs),
    blogs: maxBlogs,
  };
};

const mostLikes = (blogs) => {
  const groupByLikes = {};
  blogs.forEach((blog) => {
    groupByLikes[blog.author] = groupByLikes[blog.author]
      ? (groupByLikes[blog.author] += blog.likes)
      : blog.likes;
  });
  const maxLikes = Math.max(...Object.values(groupByLikes));
  return {
    author: _.findKey(groupByLikes, (val) => val === maxLikes),
    likes: maxLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
