name: 'install-npm-packages'

# yamllint disable-line rule:truthy
on:
    push:
        branches:
            - main

jobs:
    install-pi:
        runs-on: ubuntu-latest
        strategy:
            matrix:
                hostname: [100.120.238.39, 100.94.159.89]
            fail-fast: false
        steps:
            - name: Tailscale
              uses: tailscale/github-action@v1
              with:
                  authkey: ${{ secrets.TAILSCALE_AUTH_KEY }}
          
            - name: Run Install script
              uses: garygrossgarten/github-action-ssh@release
              with:
                command: /home/pi/app/pi/update-npm-packages.sh
                host: ${{ matrix.hostname }}
                username: pi
                password: ${{ secrets.RASPI_PASSPHRASE }}
