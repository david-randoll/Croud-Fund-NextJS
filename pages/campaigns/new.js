import React, { Component, useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

const CampaignNew = () => {
    const [minimumContribution, setMinimumContribution] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage("");
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(minimumContribution).send({ from: accounts[0] });

            Router.pushRoute("/");
        } catch (err) {
            setErrorMessage(err.message);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <h3>Create a Campaign</h3>
            <Form onSubmit={onSubmit} error={errorMessage !== ""}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input
                        label="wei"
                        labelPosition="right"
                        placeholder="min contribution amount"
                        value={minimumContribution}
                        type="number"
                        onChange={(event) => setMinimumContribution(event.target.value)}
                    />
                </Form.Field>

                <Message error header="Oops!" content={errorMessage} />
                <Button primary loading={loading}>
                    Create!
                </Button>
            </Form>
        </Layout>
    );
};

export default CampaignNew;
