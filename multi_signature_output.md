### Task: Multi Signature 

First run `npm run create_allowance`

Output after running `npm run multi_signature` first time:
```sh
- Account 0.0.49352329: 1480 ℏ
- Account 0.0.49352330: 1498.64577306 ℏ
- Account 0.0.49352332: 1520 ℏ
```

Output after running `npm run multi_signature` second time:
```sh
Error: {"name":"StatusError","status":"SPENDER_DOES_NOT_HAVE_ALLOWANCE","transactionId":"0.0.49352330@1674215006.290661633","message":"receipt for transaction 0.0.49352330@1674215006.290661633 contained error status SPENDER_DOES_NOT_HAVE_ALLOWANCE"}
```
