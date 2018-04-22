import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import {
  Container,
  Table,
  Button,
  Loader,
  Header,
  Select,
  Input,
} from 'semantic-ui-react';
import BoolIcon from 'lib/components/BoolIcon';
import UserEditor from './UserEditor';
import { listAdmins as listAdminsAction } from '../actions/adminActions';
import {
  searchUsers as searchUsersAction,
  clearUsersAction,
} from '../actions/usersActions';
import { openUserEditor as openUserEditorAction } from '../actions/userEditorActions';

const UserSearchOptions = [
  { key: 'username', text: 'Username', value: 'username' },
  { key: 'firstName', text: 'First Name', value: 'firstName' },
  { key: 'lastName', text: 'Last Name', value: 'lastName' },
];

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteUserModal: null,
      userSearchMode: 'username',
      userSearchString: '',
    };
  }

  componentDidMount() {
    const { listAdmins } = this.props;
    listAdmins();
  }

  componentWillUpdate(nextProps) {
    const { listAdmins, editorActive } = this.props;
    if (editorActive && !nextProps.editorActive) {
      listAdmins();
    }
  }

  search() {
    const { searchUsers } = this.props;
    const { userSearchMode, userSearchString } = this.state;
    searchUsers(userSearchMode, userSearchString);
  }

  renderUser(user) {
    const { openUserEditor } = this.props;
    const { username, firstName, lastName, isStaff } = user;

    const editButton = (
      <Button
        size="tiny"
        compact
        onClick={() => openUserEditor({ object: user })}
      >
        Edit
      </Button>
    );

    return (
      <Table.Row key={user.id} className="admin-table-row">
        <Table.Cell>{username}</Table.Cell>
        <Table.Cell>{firstName}</Table.Cell>
        <Table.Cell>{lastName}</Table.Cell>
        <Table.Cell>
          <BoolIcon value={isStaff} />
        </Table.Cell>
        <Table.Cell>
          <div className="actions">{editButton}</div>
        </Table.Cell>
      </Table.Row>
    );
  }

  renderUsers(users) {
    if (!users) {
      return <Loader active inline="centered" />;
    }

    return (
      <Table className="admin-table hoverable" selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>USERNAME</Table.HeaderCell>
            <Table.HeaderCell>FIRST NAME</Table.HeaderCell>
            <Table.HeaderCell>LAST NAME</Table.HeaderCell>
            <Table.HeaderCell>ADMIN ACCESS</Table.HeaderCell>
            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{users.map(b => this.renderUser(b)).toList()}</Table.Body>
      </Table>
    );
  }

  renderUserSearch() {
    const { userSearchString } = this.state;
    return (
      <Input type="text" placeholder="Search..." action>
        <input
          value={userSearchString}
          onChange={({ target: { value: userSearchString } }) =>
            this.setState({ userSearchString })
          }
        />
        <Select
          compact
          options={UserSearchOptions}
          defaultValue="username"
          onChange={(e, { value: userSearchMode }) =>
            this.setState({ userSearchMode })
          }
        />
        <Button type="submit" onClick={() => this.search()}>
          Search
        </Button>
      </Input>
    );
  }

  renderSearchedUsers() {
    const { users, clearUsers } = this.props;

    const usersTable =
      users.count() > 0 ? (
        <div>
          {this.renderUsers(users)}
          <Button onClick={() => clearUsers()}> Clear </Button>
        </div>
      ) : (
        <span>No search results.</span>
      );

    return (
      <div>
        <Container
          style={{ paddingTop: '40px', paddingBottom: '15px', display: 'flex' }}
        >
          <Header as="h2" style={{ flexGrow: '1' }}>
            Users
          </Header>
          {this.renderUserSearch()}
        </Container>
        {usersTable}
      </div>
    );
  }

  renderAdmins() {
    const { admins } = this.props;
    return (
      <div>
        <Container style={{ paddingBottom: '10px' }}>
          <Header as="h2">Admins</Header>
        </Container>
        {this.renderUsers(admins)}
      </div>
    );
  }

  render() {
    const { editorActive, openUserEditor, usersError } = this.props;
    if (openUserEditor && editorActive) {
      return <UserEditor />;
    }

    return (
      <div>
        {usersError ? String(usersError) : null}
        {this.renderAdmins()}
        {this.renderSearchedUsers()}
      </div>
    );
  }
}

UsersView.propTypes = {
  admins: PropTypes.instanceOf(Map),
  adminsError: PropTypes.object,
  users: PropTypes.instanceOf(Map),
  usersError: PropTypes.object,
  editorActive: PropTypes.bool,
  /* dispatch */
  listAdmins: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  clearUsers: PropTypes.func.isRequired,
  openUserEditor: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    admins: state.admins.get('data'),
    adminsError: state.admins.get('error'),
    users: state.users.get('data'),
    usersError: state.users.get('error'),
    editorActive: state.userEditor.get('active', false),
  };
};

const mapDispatchToProps = {
  listAdmins: listAdminsAction,
  searchUsers: searchUsersAction,
  clearUsers: clearUsersAction,
  openUserEditor: openUserEditorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);
