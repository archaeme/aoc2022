#include <errno.h>
#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdnoreturn.h>
#include <string.h>

noreturn void error(const char *msg) {
	fprintf(stderr, "%s: %s\n", msg, strerror(errno));
	exit(EXIT_FAILURE);
}

int main(void) {
	FILE *f = fopen("input.txt", "r");
	if (!f) {
		error("Unable to open input.txt");
	}

	int containing = 0;
	int overlapping = 0;
	int pair1[2];
	int pair2[2];
	while (fscanf(f, "%d-%d,%d-%d\n", &pair1[0], &pair1[1], &pair2[0], &pair2[1]) == 4) {
		bool pair1_in_pair2 = pair1[0] >= pair2[0] && pair1[1] <= pair2[1];
		bool pair2_in_pair1 = pair2[0] >= pair1[0] && pair2[1] <= pair1[1];

		if (pair1_in_pair2 || pair2_in_pair1) {
			containing++;
		}

		if (pair1[0] <= pair2[1] && pair1[1] >= pair2[0]) {
			overlapping++;
		}
	}
	if (ferror(f)) {
		error("Cannot read input.txt");
	}

	fclose(f);

	printf("[Part 1] Fully contained pairs: %d\n", containing);
	printf("[Part 2] Overlapping pairs: %d\n", overlapping);

	return EXIT_SUCCESS;
}
