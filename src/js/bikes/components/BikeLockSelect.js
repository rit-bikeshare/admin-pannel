import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map, Set } from 'immutable';
import { Select, Form } from 'semantic-ui-react';
import { record as BikeLock, locksListAction } from 'locks/redux/locks';

class BikeLockSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedId: null };
  }

  componentDidMount() {
    const { locksList } = this.props;
    locksList();
  }

  render() {
    const {
      locksStatus,
      locks,
      availableLocks,
      lock: maybeNullLock,
      onChange,
    } = this.props;
    const { message } = this.state;
    if (locksStatus === 'PENDING') {
      return <Select placeholder="Select bike lock" search loading />;
    }

    const lock = maybeNullLock || -1;

    const options = Set(
      availableLocks
        .set('-1', new BikeLock({ id: -1 }))
        .set(lock, new BikeLock({ id: lock }))
        .map(({ id }) =>
          Map({ key: id, text: id === -1 ? 'No lock' : id, value: id })
        )
        .toList()
    );

    return (
      <Form.Field>
        <label>Lock id:</label>
        {message ? <span>{message}</span> : null}
        <Select
          placeholder="Select bike lock"
          search
          allowAdditions
          options={options.toJS()}
          value={lock}
          onChange={(e, { value }) => {
            const num = Number(value);
            if (num === -1 || availableLocks.has(num) || !locks.has(num)) {
              this.setState({ message: null });
              onChange(num === -1 ? null : num);
            } else {
              this.setState({
                message: `Lock with id ${num} exists and is assigned to another bike.`,
              });
            }
          }}
        />
      </Form.Field>
    );
  }
}

BikeLockSelect.propTypes = {
  availableLocks: PropTypes.instanceOf(Map),
  locks: PropTypes.instanceOf(Map),
  locksStatus: PropTypes.string,
  locksError: PropTypes.object,
  lock: PropTypes.string,
  onChange: PropTypes.func,
  /* dispatch */
  locksList: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const locks = state.locks.get('data');
  const editorBike = state.bikeEditor.get('bike');
  const editorBikeLock = locks.get(editorBike.lock);
  const bikes = state.bikes.get('data').set(editorBike.id, editorBike);

  const availableLocks = (() => {
    if (locks.count() > 0) {
      const usedIds = Set(
        bikes
          .filter(({ lock }) => lock != null)
          .map(({ lock }) => lock)
          .toList()
      );
      const filtered = locks.filter(({ id }) => !usedIds.contains(id));
      return editorBikeLock
        ? filtered.set(editorBikeLock.id, editorBikeLock)
        : filtered;
    }

    return locks;
  })();

  return {
    availableLocks,
    locks,
    locksStatus: state.locks.get('status'),
    locksError: state.locks.get('error'),
  };
};

const mapDispatchToProps = {
  locksList: locksListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(BikeLockSelect);