cypress:
	gnome-terminal --tab -- sh -c "npm run serve --prefix examples/Vue; bash"
	npx cypress open

.PHONY: cypress