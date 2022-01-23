import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/Campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";

const RequestNew = ({ address }) => {
    const [value, setValue] = useState("");
    const [description, setDescription] = useState("");
    const [recipient, setRecipient] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage("");

        const campaign = Campaign(address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
                .send({
                    from: accounts[0],
                });

            Router.pushRoute(`/campaigns/${address}/requests`);
        } catch (err) {
            setErrorMessage(err.message);
        }

        setLoading(false);
    };

    return (
        <Layout>
            <Link route={`/campaigns/${address}/requests`}>
                <a>Back</a>
            </Link>
            <h3>Create a Request</h3>
            <Form onSubmit={handleSubmit} error={errorMessage !== ""}>
                <Form.Field>
                    <label>Description</label>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Field>

                <Form.Field>
                    <label>Request Amount</label>
                    <Input
                        label="Ether"
                        labelPosition="right"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Recipient</label>
                    <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                </Form.Field>

                <Message error header="Oops!" content={errorMessage} />
                <Button primary loading={loading}>
                    Create
                </Button>
            </Form>
        </Layout>
    );
};

RequestNew.getInitialProps = async (props) => {
    const { address } = props.query;
    return {
        address,
    };
};

export default RequestNew;
