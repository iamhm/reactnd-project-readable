import React from 'react';
import PropTypes from 'prop-types';
import PostDisplay from '../post/postDisplay';
import ErrorStatus from '../shared/errorStatus';
import ProgressStatus from '../shared/progressStatus';

import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllPosts, votePost } from '../../actions/postActions';

class HomePage extends React.Component {
  constructor() {
    super();

    this.state = {
      sortBy: 'voteScore' // either 'voteScore' or 'timestamp'
    };

    this.onVoteClick = this.onVoteClick.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.sortByDescending = this.sortByDescending.bind(this);
  }

  componentDidMount() {
    this.props.getPosts();
  }

  onVoteClick(postId, voteValue) {
    const voteOption = { option: voteValue };
    this.props.votePost(postId, voteOption);
  }

  onSortChange(e) {
    e.preventDefault();

    const sortValue = e.target.value;
    this.setState({ sortBy: sortValue });
  }

  sortByDescending(array, propertyName) {
    return array.sort((x, y) => {
      return y[propertyName] - x[propertyName];
    });
  }

  render() {
    const sortedPosts = this.sortByDescending(
      this.props.posts,
      this.state.sortBy
    );

    if (this.props.isFetching) {
      return <ProgressStatus />;
    }

    if (this.props.isError) {
      return <ErrorStatus message={this.props.message} />;
    }

    return (
      <div className="wrapper top">

        <div className="actions">

          <label htmlFor="sort">Sort By</label>
          &nbsp;
          <select id="sort" name="sort" onChange={this.onSortChange}>
            <option value="voteScore">vote</option>
            <option value="timestamp">date</option>
          </select>

          <NavLink
            to={'/new'}
            className="lnk lnk-primary">
            Create
          </NavLink>
        </div>

        {sortedPosts.map((post) => {
          return (
            <PostDisplay
              key={post.id}
              post={post}
              voteHandler={this.onVoteClick}
            />
          );
        })}
      </div>
    );
  }
}

HomePage.propTypes = {
  isFetching: PropTypes.bool,
  isError: PropTypes.bool,
  message: PropTypes.string,
  posts: PropTypes.array,
  getPosts: PropTypes.func,
  votePost: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.post.isFetching,
    isError: state.post.isError,
    message: state.post.message,
    posts: state.post.posts
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPosts: bindActionCreators(getAllPosts, dispatch),
    votePost: bindActionCreators(votePost, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
