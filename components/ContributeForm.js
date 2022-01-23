import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/Campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

const ContributeForm = ({ address }) => {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage("");

        const campaign = Campaign(address);
        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, "ether"),
            });

            Router.replaceRoute(`/campaigns/${address}`);
        } catch (err) {
            setErrorMessage(err.message);
        }

        setLoading(false);
        setValue("");
    };
    return (
        <div>
            <Form onSubmit={handleSubmit} error={errorMessage !== ""}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                        label="ether"
                        labelPosition="right"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </Form.Field>
                <Message error header="Oops!" content={errorMessage} />
                <Button primary loading={loading}>
                    Contribute
                </Button>
            </Form>
        </div>
    );
};

export default ContributeForm;
