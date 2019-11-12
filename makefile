cypress:
	gnome-terminal --tab -- sh -c "npm run serve --prefix examples/Cypress; bash"
	npx cypress open

.PHONY: cypress