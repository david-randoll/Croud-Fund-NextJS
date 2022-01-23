import React from "react";
import { Button, Tab, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import Campaign from "../../../ethereum/Campaign.js";
import RequestRow from "../../../components/RequestRow";

const RequestIndex = ({ address, requestCount, requests, approversCount }) => {
    const renderRow = () => {
        return requests.map((request, index) => {
            return (
                <RequestRow
                    key={index}
                    request={request}
                    address={address}
                    id={index}
                    approversCount={approversCount}
                />
            );
        });
    };

    return (
        <Layout>
            <h3>Request List</h3>
            <Link route={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary floated="right" style={{ marginBottom: 10 }}>
                        Add Request
                    </Button>
                </a>
            </Link>

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Recipient</Table.HeaderCell>
                        <Table.HeaderCell>Approval Count</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Finalize</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{renderRow()}</Table.Body>
            </Table>
            <div>Found {requestCount} requests</div>
        </Layout>
    );
};

RequestIndex.getInitialProps = async (props) => {
    const { address } = props.query;

    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
        Array(parseInt(requestCount))
            .fill()
            .map((element, index) => {
                return campaign.methods.requests(index).call();
            })
    );

    return {
        address,
        requestCount,
        requests,
        approversCount,
    };
};

export default RequestIndex;
