import React from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { Marker } from 'react-google-maps';
import { Button, Modal, List } from 'semantic-ui-react';

import BoolIcon from 'lib/components/BoolIcon';
import GMap from 'app/components/GMap';
import DamageReportsTable from './DamageReportsTable';

class UnAckTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportDetail: null,
    };
    this.handleDetailClose = this.handleDetailClose.bind(this);
    this.renderReportActions = this.renderReportActions.bind(this);
  }

  openDetailsModal(report) {
    this.setState({
      reportDetail: report,
    });
  }

  handleDetailClose() {
    this.setState({
      reportDetail: null,
    });
  }

  renderReport(report) {
    const { id, comments, damageType, critical } = report;
    return (
      <List.Item key={id}>
        <List>
          <List.Item className="m-bottom-2">
            <List.Header>Report ID</List.Header>
            {id}
          </List.Item>
          <List.Item className="m-bottom-2">
            <List.Header>Damage Type</List.Header>
            {damageType}
          </List.Item>
          <List.Item className="m-bottom-2">
            <List.Header>Comments</List.Header>
            {comments}
          </List.Item>
          <List.Item className="m-bottom-2">
            <List.Header>Bike can function</List.Header>
            <BoolIcon value={!critical} />
          </List.Item>
        </List>
      </List.Item>
    );
  }

  renderDetailsModal() {
    const { reportDetail } = this.state;

    if (!reportDetail) return null;
    const bike = reportDetail.get('bike');
    const reports = reportDetail.get('reports');

    const location = {
      lat: bike.lat,
      lng: bike.lon,
    };

    return (
      <Modal onClose={this.handleDetailClose} open={true} closeIcon={true}>
        <Modal.Header>Damage Details</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <GMap defaultCenter={location}>
              <Marker position={location} label={`${bike.id}`} />
            </GMap>
            <h4>Reports for bike #{bike.id}</h4>
            <List divided relaxed>
              {reports.map(report => this.renderReport(report))}
            </List>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }

  renderReportActions(id, data) {
    const { deleteDamageReport, ackDamageReport } = this.props;
    return (
      <div className="actions">
        <Button size="tiny" compact onClick={() => this.openDetailsModal(data)}>
          Details
        </Button>
        <Button size="tiny" compact onClick={() => deleteDamageReport(id)}>
          Delete
        </Button>
        <Button size="tiny" compact onClick={() => ackDamageReport(id)}>
          Acknowledge
        </Button>
      </div>
    );
  }

  render() {
    const { damageReports } = this.props;
    return (
      <span>
        {this.renderDetailsModal()}
        <DamageReportsTable
          renderReportActions={this.renderReportActions}
          damageReports={damageReports}
        />
      </span>
    );
  }
}

UnAckTable.propTypes = {
  damageReports: PropTypes.instanceOf(Map),
  deleteDamageReport: PropTypes.func,
  ackDamageReport: PropTypes.func,
};

export default UnAckTable;
