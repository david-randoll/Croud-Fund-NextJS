import React, { useEffect, useState } from "react";
import { Button, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/Campaign.js";
import { Router } from "../routes";

const RequestRow = ({ request, address, id, approversCount }) => {
    const [hasApproved, setHasApproved] = useState(true);

    const readyToFinalize = request.approvalCount > approversCount / 2;

    const handleApprove = async () => {
        const camp = Campaign(address);
        const accounts = await web3.eth.getAccounts();
        await camp.methods.approveRequest(id).send({
            from: accounts[0],
        });
        Router.pushRoute(`/campaigns/${address}/requests`);
    };
    const handleFinalize = async () => {
        const camp = Campaign(address);
        const accounts = await web3.eth.getAccounts();
        await camp.methods.finalizeRequest(id).send({
            from: accounts[0],
        });
        Router.pushRoute(`/campaigns/${address}/requests`);
    };

    useEffect(() => {
        const hasApproveRequest = async () => {
            const camp = Campaign(address);
            const accounts = await web3.eth.getAccounts();
            const isApproved = await camp.methods.hasSenderApproveRequest(id).call({
                from: accounts[0],
            });
            setHasApproved(isApproved);
        };
        hasApproveRequest();
    }, []);

    return (
        <Table.Row
            disabled={request.complete}
            positive={readyToFinalize && request.complete == false}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{request.description}</Table.Cell>
            <Table.Cell>{web3.utils.fromWei(request.value, "ether")}</Table.Cell>
            <Table.Cell>{request.recipient}</Table.Cell>
            <Table.Cell>
                {request.approvalCount}/{approversCount}
            </Table.Cell>
            <Table.Cell>
                {hasApproved === false && (
                    <Button color="green" basic onClick={handleApprove}>
                        Approve
                    </Button>
                )}
            </Table.Cell>
            <Table.Cell>
                {request.complete === false && (
                    <Button color="teal" basic onClick={handleFinalize}>
                        Finalize
                    </Button>
                )}
            </Table.Cell>
        </Table.Row>
    );
};

export default RequestRow;
