// for getline
#define _XOPEN_SOURCE 700
#include <errno.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {
	FILE *f = fopen("input.txt", "r");
	if (!f) {
		fprintf(stderr, "Unable to open input.txt: %s\n", strerror(errno));
		return EXIT_FAILURE;
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

	printf("[Part 1] Fully contained pairs: %d\n", containing);
	printf("[Part 2] Overlapping pairs: %d\n", overlapping);

	return EXIT_SUCCESS;
}
